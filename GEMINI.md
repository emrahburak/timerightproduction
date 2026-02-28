# GEMINI.md - Instructional Context for timerightproduction.org

## Project Overview

**timerightproduction.org** is a high-performance, multi-language (English/Turkish) website for **Time Right Production**, built with modern web technologies focused on performance, smooth animations, and type safety.

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP (GreenSock Animation Platform) + `@gsap/react`, Lenis (Smooth Scroll)
- **Internationalization (i18n):** Custom localized routing using the `[locale]` dynamic route pattern with JSON-based message storage.

### Key Architecture Patterns
- **Server/Client Hybrid:** Heavy use of React Server Components (RSC) for data fetching and layout, with targeted `'use client'` components for interactive sections (Hero, ScrollManager, etc.).
- **Localized Routing:** All routes are prefixed with the locale (`/en`, `/tr`). Static params are generated for supported locales.
- **GSAP Animations:** Animations are integrated via `ScrollManager.tsx` and internal section pinning to create a slide-over and horizontal scrolling experience.

## Building and Running

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server at `http://localhost:3000` |
| `npm run build` | Builds the application for production (includes type checking) |
| `npm run start` | Starts the production server (requires `npm run build` first) |
| `npm run lint` | Runs ESLint for code quality checks |

### Type Checking
- Type checking is strictly enforced via `tsconfig.json`.
- Run `npx tsc --noEmit` to check for type errors manually.

## Development Conventions

### File Naming & Structure
- **Components:** `PascalCase.tsx` (e.g., `Header.tsx`, `Hero.tsx`).
- **Pages/Routes:** kebab-case within the `app/` directory.
- **Internal Components:** Grouped under `src/components/sections/` for page-specific sections.
- **Internationalization:** Messages are stored in `src/messages/` as `en.json` and `tr.json`.

### Coding Standards
- **Strict TypeScript:** No `any` types. Interfaces should be used for component props.
- **Server Components by Default:** Keep components as Server Components unless they require hooks (`useState`, `useEffect`) or browser APIs.
- **Path Aliases:** Always use `@/` for imports from the `src` directory (e.g., `import { Hero } from '@/components/Hero'`).
- **Images:** Use Next.js `<Image>` component for optimization. Remote domains (Unsplash, timerightproduction.org) are pre-configured in `next.config.ts`.

### MAESTRO Protocol Implementation
This project follows the **Maestro Protocol** for AI-assisted development:
1. **Gemini (Architect):** Analyzes requests, plans changes in `ARCH.md`, and verifies results.
2. **Aider (Developer):** Executes instructions from `ARCH.md`.
3. **ARCH.md:** Acts as the source of truth for current development tasks, containing specific file paths and line-level instructions.

## Key Files Summary

- `src/app/[locale]/layout.tsx`: Root layout with font configurations and global components (Header, SmoothScroll).
- `src/app/[locale]/page.tsx`: Main landing page composed of multiple scroll-triggered sections.
- `src/components/ScrollManager.tsx`: Core component for managing global scroll states and GSAP triggers.
- `src/messages/[en|tr].json`: Source of truth for all UI text and translations.
- `tailwind.config.ts`: Theme configuration including custom colors and fonts.

## Usage for AI Agents
- When modifying text, always update both `src/messages/en.json` and `src/messages/tr.json`.
- When adding new sections, update `src/app/[locale]/page.tsx` and add types to the `Messages` interface.
- Ensure all GSAP animations are cleaned up properly using `@gsap/react` hooks to prevent memory leaks.
