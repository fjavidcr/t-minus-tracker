# T-Minus Tracker 🚀

<!-- <p align="center"><img src="PATH_TO_LOGO" alt="T-Minus Logo" width="200"/></p> -->

<div align="center">
  <p><strong>Real-time space mission tracking and telemetry monitoring platform.</strong></p>

  [![Deploy Landing](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/landing.yml/badge.svg)](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/landing.yml)
  [![Deploy WebApp](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/webapp.yml/badge.svg)](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/webapp.yml)
  [![Security](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/security.yml/badge.svg)](https://github.com/fjavidcr/t-minus-tracker/actions/workflows/security.yml)
  [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
</div>

---

T-Minus Tracker is a high-performance space intelligence platform designed for real-time mission tracking and deep telemetry visualization. Built as a modern monorepo, it leverages a distributed architecture to provide a seamless experience from the cinematic landing page to the high-granularity mission control application.

## ⚡ Tech Stack

This project is built using the latest industry-leading technologies:

- **Frameworks**:
  - [**Nuxt 4**](https://nuxt.com/) (Webapp) - Real-time mission control.
  - [**Astro 6**](https://astro.build/) (Landing) - High-performance cinematic experience.
- **Styling**: [**Tailwind CSS v4**](https://tailwindcss.com/) - Next-generation utility-first CSS.
- **Runtime**: [**Node.js 24+**](https://nodejs.org/) with [**TypeScript 5.9**](https://www.typescriptlang.org/).
- **Monorepo**: [**Turborepo**](https://turbo.build/) + [**pnpm**](https://pnpm.io/) workspaces.
- **UI Architecture**: Shared component library with [**Reka UI**](https://reka-ui.com/) and [**Lucide Icons**](https://lucide.dev/).

## 📦 Monorepo Structure

```text
├── apps/               # Main Applications
│   ├── webapp/         # Nuxt 4 Mission Control Dashboard (Deployed to Vercel)
│   └── landing/        # Astro 6 Cinematic Landing Page (Deployed to Cloudflare)
├── packages/           # Shared Workspace Packages
│   ├── ui/             # Core UI components and Design System
│   ├── theme/          # Centralized Tailwind v4 configuration
│   ├── utils/          # Shared business logic and telemetry helpers
│   ├── eslint-config/  # Unified linting rules
│   └── typescript-config/ # Base TS configurations
├── docs/               # Technical documentation
└── .github/            # CI/CD and Security Workflows
```

## 🏗 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24.14
- [pnpm](https://pnpm.io/) >= 10.0
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) (for local security audits)

### Installation

```bash
# Clone the repository
git clone https://github.com/fjavidcr/t-minus-tracker.git
cd t-minus-tracker

# Install dependencies across the workspace
pnpm install
```

### Development

```bash
# Start all apps in parallel
pnpm run dev

# Build for production
pnpm run build
```

## 🛡️ Security First

T-Minus Tracker implements enterprise-grade security verifications:

- **Static Analysis (SAST)**: Automated [**CodeQL**](https://codeql.github.com/) scanning identifying vulnerabilities in real-time.
- **Secrets Management**: Integrated **Trivy** (CI) and **TruffleHog** (Local) to prevent credential leaks.
- **Dependency Hygiene**: Workspace-wide auditing via `pnpm audit` for zero-day vulnerability protection.

To run a local security audit:
```bash
pnpm run scan:secrets   # Scan for hardcoded credentials
pnpm run audit:deps     # Check for vulnerable dependencies
```

## 📖 In-Depth Documentation

Explore more technical details in our dedicated documentation:
- [**Full Monorepo Architecture**](./docs/MONOREPO.md)
- [**Deployment Strategy**](./docs/DEPLOYMENT.md)

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

- ✅ **Personal & Educational Use**: Allowed.
- ❌ **Commercial Use**: Strictly prohibited without prior authorization.
- 🔗 **Attribution**: Required to the original author.

---
**Author:** [F. Javier del Castillo Ramírez](https://github.com/fjavidcr)
