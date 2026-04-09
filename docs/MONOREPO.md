# T-Minus Tracker: Monorepo Architecture

Welcome to the **T-Minus Tracker** workspace. This repository is structured as a modern monorepo, designed for real-time mission tracking and telemetry monitoring.

## 🏗 Repository Structure

Managed by [Turborepo](https://turbo.build/), this monorepo uses **pnpm workspaces** for granular dependency management and ultra-fast task execution.

### Organization

```text
t-minus-tracker/
├── apps/               # Main Applications
│   ├── webapp/         # Nuxt 4 (SSR) Mission Dashboard (Vercel)
│   └── landing/        # Astro 6 (SSG) Landing Page (Cloudflare)
├── packages/           # Shared Workspace Packages
│   ├── ui/             # Shared Vue component library
│   ├── theme/          # Centralized Tailwind CSS v4 design tokens
│   ├── utils/          # Business logic and telemetry helpers
│   ├── eslint-config/  # Unified ESLint 9 configuration
│   └── typescript-config/ # Base TypeScript 5.9 configurations
├── docs/               # Technical documentation
└── turbo.json          # Turborepo task pipeline
```

## 🚀 Core Components

### 1. Web Application (`apps/webapp`)
- **Technology**: [Nuxt 4](https://nuxt.com/) (Vue 3.5+)
- **Styling**: Tailwind CSS v4 + Reka UI
- **Focus**: Interactive mission control dashboard with real-time telemetry.

### 2. Landing Page (`apps/landing`)
- **Technology**: [Astro 6](https://astro.build/)
- **Focus**: High performance, SEO-optimized marketing site for space intelligence.

### 3. Shared Packages (`packages/`)
- **`@t-minus/ui`**: Reusable components (buttons, cards, telemetry charts).
- **`@t-minus/theme`**: Central point for Tailwind v4 configuration, ensuring visual consistency.
- **`@t-minus/utils`**: Shared formatters, math helpers, and mission state logic.

## 🛠 Development Workflow

### Requirements
- **Node.js**: >= 24.14
- **pnpm**: >= 10.0

### Local Setup

```bash
# Install dependencies for all apps and packages
pnpm install

# Build the entire workspace
pnpm run build

# Start core applications in development mode
pnpm run dev
```

### Task Execution (Turborepo)
Turborepo orchestrates builds and checks efficiently. It will skip tasks that haven't changed since the last run.

```bash
pnpm run lint        # Lint the entire monorepo
pnpm run typecheck   # Validate TypeScript across all packages
pnpm run format      # Standardize code style
```

## 🛡️ Security Audit

Before committing or deploying, run the local security suite:

- `pnpm run scan:secrets`: Scans history and filesystem for leaks (TruffleHog).
- `pnpm run audit:deps`: Checks for vulnerable third-party dependencies.

---
*Exploración espacial con telemetría de vanguardia.*
