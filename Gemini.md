# Project Context: timerightproduction.org

## 🎯 Project Overview

- **Type:** High-end Video Production & Creative Agency Website.
- **Goal:** Cinematic storytelling, minimalist design, high-performance animations.
- **Tech Stack:** Next.js 15+ (App Router), TypeScript, GSAP (ScrollTrigger), Tailwind CSS, Coolify (Deployment), Cloudflare Tunnel.

## 🏗️ Technical Architecture

- **Directives:** Always use `"use client";` for components with GSAP/Ref.
- **Internationalization (i18n):** Custom implementation using `src/messages/` (tr.json, en.json) and `src/proxy.ts` (formerly middleware).
- **Deployment:** - Main: `timerightproduction.org` (main branch)
  - Staging/Develop: `develop.timerightproduction.org` (develop branch - Port 3005)

## 🎨 Design System & UI Components

- **Typography:** - Titles: `font-syne` (Uppercase, Bold)
  - Content: `font-cormorant` (Italic, Serif)
- **Current Sections:**
  - `Hero`: Infinite marquee animation.
  - `Statement`: Split-text reveal.
  - `About`: 150vh depth with parallax content flow.
  - `Services`: Arc-Carousel (Curved horizontal scroll) moving from right to left.

## ⚠️ Core Rules for AI Agent (Gemini-cli)

1. **Type Safety:** Always define interfaces for Messages and SectionProps.
2. **GSAP Cleanup:** Ensure `useGSAP` or `gsap.context` is used for proper memory management.
3. **No Placeholders:** Avoid dummy content; use the current language keys from `tr.json/en.json`.
5. **Language Constraint:** Instructions in `ARCH.md` must ALWAYS be written in English to ensure compatibility with external tools (Aider/Aider-cli).

## 📅 Roadmap (Next Steps)

- [ ] Implement the "Intermediate/Transition" section (Ara Bileşen).
- [ ] Develop the Team Section with staggered reveal.
- [ ] Build the high-contrast Contact Section.
- [ ] Final visual polishing & performance optimization.
