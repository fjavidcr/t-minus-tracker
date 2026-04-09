#!/usr/bin/env node

/**
 * create-releases.js
 *
 * Generates Git tags and GitHub releases for each app in the monorepo.
 * This script is designed to run after Changesets has versioned the packages.
 *
 * It:
 * 1. Detects which apps were versioned (landing, webapp)
 * 2. Reads the new versions from package.json
 * 3. Extracts changelog entries for each version
 * 4. Creates Git tags and GitHub releases
 */

import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const APPS = ['landing', 'webapp']
const REPO_ROOT = path.join(__dirname, '..')
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || 'fjavidcr/t-minus-tracker'

// Logging utilities
const log = {
  error: (msg) => console.error(`❌ ${msg}`),
  // eslint-disable-next-line no-console
  info: (msg) => console.log(`ℹ️  ${msg}`),
  // eslint-disable-next-line no-console
  success: (msg) => console.log(`✅ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`)
}

/**
 * Create a GitHub release using gh CLI
 */
function createGitHubRelease(tagName, title, notes) {
  try {
    // Prepare the release body
    const bodyFile = path.join(process.env.RUNNER_TEMP || '/tmp', `release-${tagName}.md`)
    fs.writeFileSync(bodyFile, notes)

    exec('gh', [
      'release',
      'create',
      tagName,
      '--title',
      title,
      '--notes-file',
      bodyFile,
      '--repo',
      GITHUB_REPOSITORY
    ])
    log.success(`Created GitHub release: ${tagName}`)

    // Clean up temp file
    try {
      fs.unlinkSync(bodyFile)
    } catch {
      // Ignore cleanup errors
    }

    return true
  } catch (error) {
    log.error(`Failed to create GitHub release ${tagName}: ${error.message}`)
    return false
  }
}

/**
 * Create a Git tag
 */
function createTag(tagName, message = '') {
  try {
    exec('git', ['tag', '-a', tagName, '-m', message || tagName])
    log.success(`Created tag: ${tagName}`)
    return true
  } catch (error) {
    log.error(`Failed to create tag ${tagName}: ${error.message}`)
    return false
  }
}

/**
 * Execute shell command and return output
 */
function exec(file, args = [], options = {}) {
  try {
    return execFileSync(file, args, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    }).trim()
  } catch (error) {
    if (options.ignoreError) {
      return ''
    }
    throw error
  }
}

/**
 * Extract changelog for a specific version from CHANGELOG.md
 *
 * The Changesets changelog format is:
 * # @t-minus/app-name
 * ## 1.2.3
 * ### Change Type
 * - Change description
 * ## 1.2.2
 * ...
 */
function extractChangelogForVersion(changelogPath, version) {
  const content = readFile(changelogPath)
  const lines = content.split('\n')

  let releaseNotes = []
  let captureLines = false
  let foundVersion = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Look for the version heading (## X.Y.Z)
    if (line.startsWith(`## ${version}`) && !foundVersion) {
      captureLines = true
      foundVersion = true
      continue // Skip the version heading itself
    }

    // Stop when we hit the next version or end of changelog
    if (captureLines && line.startsWith('## ')) {
      break
    }

    // Capture lines for this version
    if (captureLines) {
      releaseNotes.push(line)
    }
  }

  // Clean up: remove leading/trailing empty lines and trim each line
  releaseNotes = releaseNotes
    .slice(releaseNotes.findIndex((l) => l.trim()) || 0) // Start from first non-empty
    .reverse()
    .slice(releaseNotes.reverse().findIndex((l) => l.trim()) || 0) // End at last non-empty
    .reverse()

  return releaseNotes.join('\n').trim()
}

/**
 * Main logic: process each app
 */
async function main() {
  log.info('Starting release creation process...')

  // Validate environment
  if (!GITHUB_TOKEN) {
    log.warn('GITHUB_TOKEN not set. Skipping GitHub release creation.')
  }

  const results = {
    created: [],
    failed: [],
    skipped: []
  }

  for (const app of APPS) {
    const pkgJsonPath = path.join(REPO_ROOT, `apps/${app}/package.json`)
    const changelogPath = path.join(REPO_ROOT, `apps/${app}/CHANGELOG.md`)

    if (!fs.existsSync(pkgJsonPath)) {
      log.warn(`Skipping ${app}: package.json not found`)
      continue
    }

    // Read current version
    const pkgJson = readJSON(pkgJsonPath)
    const version = pkgJson.version
    const displayName = pkgJson.name || app
    const tagName = `${app}@${version}`

    log.info(`Processing ${app}@${version}...`)

    // Check if tag already exists
    if (tagExists(tagName)) {
      log.warn(`Tag already exists: ${tagName}`)
      results.skipped.push(tagName)
      continue
    }

    // Extract changelog
    let releaseNotes = ''
    if (fs.existsSync(changelogPath)) {
      try {
        releaseNotes = extractChangelogForVersion(changelogPath, version)
      } catch (error) {
        log.warn(`Failed to extract changelog for ${app}@${version}: ${error.message}`)
        releaseNotes = 'Release created by Changesets'
      }
    } else {
      log.warn(`Changelog not found for ${app}`)
      releaseNotes = 'Release created by Changesets'
    }

    // Create tag
    const tagCreated = createTag(tagName, `Release ${tagName}`)
    if (!tagCreated) {
      results.failed.push(tagName)
      continue
    }

    // Create GitHub release (if token is available)
    if (GITHUB_TOKEN) {
      const releaseCreated = createGitHubRelease(
        tagName,
        `${displayName} v${version}`,
        releaseNotes
      )

      if (!releaseCreated) {
        results.failed.push(tagName)
        continue
      }
    } else {
      log.info(`Skipping GitHub release for ${tagName} (no GITHUB_TOKEN)`)
    }

    results.created.push(tagName)
  }

  // Push tags to remote
  try {
    if (results.created.length > 0) {
      log.info('Pushing tags to remote...')
      exec('git push --tags')
      log.success(`Pushed ${results.created.length} tag(s) to remote`)
    }
  } catch (error) {
    log.error(`Failed to push tags: ${error.message}`)
  }

  // Summary
  // eslint-disable-next-line no-console
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  // eslint-disable-next-line no-console
  console.log('📊 Release Creation Summary')
  // eslint-disable-next-line no-console
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (results.created.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`\n✅ Created: ${results.created.length}`)
    results.created.forEach((tag) => {
      // eslint-disable-next-line no-console
      console.log(`   • ${tag}`)
    })
  }

  if (results.skipped.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`\n⏭️  Skipped: ${results.skipped.length} (already exists)`)
    results.skipped.forEach((tag) => {
      // eslint-disable-next-line no-console
      console.log(`   • ${tag}`)
    })
  }

  if (results.failed.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`\n❌ Failed: ${results.failed.length}`)
    results.failed.forEach((tag) => {
      // eslint-disable-next-line no-console
      console.log(`   • ${tag}`)
    })
  }

  // eslint-disable-next-line no-console
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Exit with error if any failed
  process.exit(results.failed.length > 0 ? 1 : 0)
}

/**
 * Read text file safely
 */
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

/**
 * Read JSON file safely
 */
function readJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * Check if a Git tag exists
 */
function tagExists(tagName) {
  const result = exec(`git tag -l "${tagName}"`, { ignoreError: true })
  return result.length > 0
}

// Run
main().catch((error) => {
  log.error(`Unexpected error: ${error.message}`)

  console.error(error)
  process.exit(1)
})
