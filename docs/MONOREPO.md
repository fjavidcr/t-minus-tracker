# T-Minus Tracker: Monorepo Documentation

Welcome to the **T-Minus Tracker** repository. This project is a space-themed mission monitoring platform, structured as a monorepo to separate the landing experience from the core application logic.

## 🏗 Repository Architecture

Managed by [Turborepo](https://turbo.build/), this monorepo uses `npm workspaces` for efficient dependency management and task execution.

### Project Structure

```text
t-minus-tracker/
├── apps/
│   ├── landing/    # Astro SSG (Landing Page)
│   └── webapp/     # Nuxt SSR (Main Tracker App)
├── docs/           # Technical documentation and plans
├── package.json    # Monorepo root
└── turbo.json      # Turborepo configuration
```

## 🚀 Applications

### 1. Landing Page (`apps/landing`)
- **Technology**: [Astro](https://astro.build/)
- **Styling**: Tailwind CSS
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (SSG)
- **Domain**: `t-minus.fjdcr.dev`
- **Focus**: High performance (LCP/CWV), SEO optimization, and premium cinematic design.

### 2. Web Application (`apps/webapp`)
- **Technology**: [Nuxt 4](https://nuxt.com/)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: [Vercel](https://vercel.com/) (SSR)
- **Domain**: `app.t-minus.fjdcr.dev`
- **Features**: Real-time orbital links, mission telemetry, secure API link (HMAC).

## 🛠 Development Workflow

### Requirements
- Node.js (v22+)
- npm (v11+)

### Common Commands

Run these from the **root directory**:

| Command | Description |
| :--- | :--- |
| `npm install` | Install all dependencies for all apps |
| `npm run dev` | Start both Astro and Nuxt in local dev mode |
| `npm run build` | Build both apps for production |
| `npm run typecheck` | Run TypeScript validation across workspaces |

### Local Ports (Default)
- **WebApp**: `http://localhost:3000`
- **Landing**: `http://localhost:4321`

## ☁️ Deployment Configuration

### Vercel (WebApp)
1. **Import** the repository.
2. Set **Root Directory** to `apps/webapp`.
3. Vercel will auto-detect Nuxt and handle the SSR build via Nitro.

### Cloudflare Pages (Landing)
1. **Connect** the repository.
2. Set **Root Directory** to `apps/landing`.
3. **Build Command**: `npm run build`.
4. **Build Output Directory**: `dist`.

## 🔒 Security & API Enclosure

The `webapp` implements a secure link with a required `NUXT_API_SECRET_KEY` for HMAC signing of requests. Ensure this environment variable is configured in your production environments (Vercel/Cloudflare).

---
*Created for the Orbitar mission - T-Minus Tracker.*
