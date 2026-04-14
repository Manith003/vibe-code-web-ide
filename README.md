# vibe-code-web-ide

**web.code** is an online Web IDE built with **Next.js (App Router)** that lets you create and run projects directly in the browser—powered by **WebContainers** (Node.js in the browser), with a modern editor/terminal experience and authenticated, database-backed playgrounds.

> Tech stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Monaco Editor, XTerm.js, WebContainers, NextAuth (GitHub + Google), Prisma + MongoDB.

---

## Features

### In-browser development environment
- **Run Node.js in the browser** using `@webcontainer/api` (no local runtime required for the “in-browser” experience).
- **Terminal experience** with `xterm` (+ fit/search/web-links addons).
- **Code editing** with **Monaco Editor** (`monaco-editor` + `@monaco-editor/react`).
- **CORS / cross-origin isolation headers** configured for WebContainer assets:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`

### Playground system (database-backed)
- **Playgrounds** stored in the database with:
  - title, description
  - template type
  - associated template files/content
- **Star / bookmark** functionality (per-user) for playgrounds.
- **Template file storage** as JSON for flexible project/file representations.

### Starter templates
Includes multiple starter templates you can base a playground on:
- **React**
- **Next.js**
- **Express**
- **Vue**
- **Angular**

(These map to the `Templates` enum in the database schema.)

### Authentication & user accounts
- **NextAuth** authentication with:
  - **GitHub OAuth**
  - **Google OAuth**
- **Prisma adapter** for NextAuth with a MongoDB database.
- **JWT session strategy**
- User model includes **roles**:
  - `ADMIN`, `USER`, `PREMIUM_USER`

### UI / DX improvements
- **Tailwind CSS** styling and utility patterns (`tailwind-merge`, `clsx`).
- **Radix UI** component primitives (dialogs, dropdowns, tabs, etc.).
- **shadcn/ui-style setup** (`components.json` present).
- **Toasts/notifications** via `sonner`.
- **Theme support** via `next-themes`.
- Helpful libraries included for rich content and UI:
  - `react-markdown` + `remark-gfm`
  - Math rendering (`remark-math`, `rehype-katex`)
  - Syntax highlighting (`shiki`, `react-syntax-highlighter`)
  - Charts (`recharts`)
  - Animations (`motion`)
  - Forms & validation (`react-hook-form`, `zod`)

---

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Editor:** Monaco Editor
- **Terminal:** XTerm.js
- **In-browser runtime:** WebContainers (`@webcontainer/api`)
- **Auth:** NextAuth (GitHub, Google)
- **DB/ORM:** Prisma + MongoDB
- **Styling/UI:** Tailwind CSS v4, Radix UI primitives, sonner

---

## Project Structure (high level)

- `app/` — Next.js App Router pages/layouts
- `features/` — feature modules (auth/actions, playground logic, etc.)
- `components/` — reusable UI components
- `lib/` — shared utilities (including database client)
- `prisma/` — Prisma schema + configuration
- `starters-main/` — starter templates used to scaffold playgrounds

---

## Getting Started (Local Development)

### 1) Install dependencies
```bash
npm install
```

### 2) Set up environment variables
Create a `.env` file (or configure in your hosting provider) with values for:

```bash
# Database
DATABASE_URL="..."

# NextAuth
AUTH_SECRET="..."

# GitHub OAuth
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Google OAuth
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
```

### 3) Prisma
Generate the Prisma client:
```bash
npx prisma generate
```

(If you have migrations/DB setup steps, run them here as needed for your MongoDB setup.)

### 4) Run the dev server
```bash
npm run dev
```

Open:
- http://localhost:3000

---

## Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint

---

## Database Models (overview)

- **User**
  - role-based (`ADMIN`, `USER`, `PREMIUM_USER`)
  - relations: playgrounds, starred playgrounds, auth accounts
- **Account**
  - OAuth account linkage (provider + providerAccountId unique)
- **Playground**
  - template type (React/Next/Express/Vue/Angular)
  - associated `TemplateFile` JSON content
- **StarMark**
  - per-user star state per playground

---

## Deployment

This is a standard Next.js app:
- Build with `npm run build`
- Run with `npm run start`

When deploying, ensure:
- All required environment variables are set
- Your MongoDB is reachable from the deployment environment
- Cross-origin isolation headers remain enabled (required for WebContainer use)

---

## Security Notes

- Never commit `.env` files or secrets to the repo.
- Use a strong `AUTH_SECRET` in production.
- Restrict OAuth callback URLs in GitHub/Google provider settings to your deployed domains.

---

## License

No license specified yet. If you want this to be open source, add a `LICENSE` file (MIT is a common choice).