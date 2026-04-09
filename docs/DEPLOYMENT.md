# T-Minus Tracker: Deployment Strategy

This document outlines the deployment architecture and CI/CD pipeline for the **T-Minus Tracker** monorepo.

## ☁️ Infrastructure Overview

T-Minus Tracker uses a heterogeneous cloud strategy to maximize performance and scalability:

| Application | Technology | Provider | Environment |
| :--- | :--- | :--- | :--- |
| **WebApp** | Nuxt 4 (SSR) | [Vercel](https://vercel.com/) | `app.t-minus.fjdcr.dev` |
| **Landing** | Astro 6 (SSG) | [Cloudflare Pages](https://pages.cloudflare.com/) | `t-minus.fjdcr.dev` |

## 🚀 CI/CD Pipeline (GitHub Actions)

All deployments are automated via GitHub Actions in the [`.github/workflows`](../.github/workflows) directory.

### Workflow Logic
1.  **Triggers**: `push` to `main` (Production) or `pull_request` (Preview).
2.  **Checks**: Every deployment requires a successful run of `checks.yml` (Lint + Typecheck).
3.  **Security**: [CodeQL](../.github/workflows/security.yml) and **Trivy** scan every PR to ensure zero-day vulnerabilities or leaked secrets aren't introduced.
4.  **Deployment**: 
    - **Preview**: Generates a unique deployment URL for every PR.
    - **Production**: Deploys to the live domain when merged into `main`.

## 🔒 Required Secrets

Ensure the following secrets are configured in **GitHub Repo Settings > Secrets and Variables > Actions**:

### Vercel (WebApp)
- `VERCEL_TOKEN`: Personal Access Token from Vercel.
- `VERCEL_PROJECT_ID`: Unique Project ID from Vercel dashboard.
- `VERCEL_ORG_ID`: Your Organization/Team ID.

### Cloudflare (Landing)
- `CLOUDFLARE_API_TOKEN`: API Token with "Cloudflare Pages" permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Account ID from Cloudflare dashboard.

## 🔑 Environment Variables

### WebApp (`apps/webapp`)
The mission control dashboard requires specific environment variables for secure orbital link telemetry:

- `NUXT_API_SECRET_KEY`: Used for HMAC signing of telemetry requests.
- `NUXT_PUBLIC_API_URL`: Base URL for the mission backend.

> [!IMPORTANT]
> **Secret Rotation**: It is recommended to rotate `NUXT_API_SECRET_KEY` every 90 days or if any security breach is suspected. Update this variable in the Vercel project settings and trigger a redeploy.

## 🛠 Manual Deployment

While automation is preferred, you can trigger manual deployments using `pnpm` from the root:

```bash
# Deploy WebApp to Vercel
pnpm run deploy:webapp

# Deploy Landing to Cloudflare Pages
pnpm run deploy:landing

# Deploy All
pnpm run deploy:all
```

---
*Created for the Orbitar mission - T-Minus Tracker.*
