# Timeright Production - Project Memory & Rules

## Technical Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Styling:** Tailwind CSS
- **Animations:** GSAP + @gsap/react (ScrollTrigger for internal section animations)
- **i18n:** JSON message files (src/messages/tr.json, en.json)
- **CDN:** Cloudflare R2 (`https://cdn.timerightproduction.org`)

---

## Architecture Principles (Updated: 17 Şubat 2026)

### 1. ScrollManager - Minimal Orchestration
- **NO ScrollTrigger:** External scroll animations kaldırıldı (Mart 2026)
- **Responsibilities:**
  - Z-index hierarchy management (hero:10 → contact:80)
  - Instructors visibility (after ShowcaseStack completion)
  - ShowcaseStack onCompletion callback injection
- **Each section manages its own internal animations**

### 2. Z-Index Hierarchy (Fixed)
```
hero: 10
statement: 20
brandgallery: 30
about: 40
services: 50
showcase-stack: 60
instructors: 70
contact: 80
```

### 3. Section Wrapper Standards
- All sections: `h-screen overflow-hidden` (except Services/ShowcaseStack: `min-h-screen`)
- `data-section` attribute for targeting
- Relative positioning, no absolute/fixed overrides

---

## Component-Specific Rules

### Services.tsx
- **Internal Horizontal Scroll:** Own ScrollTrigger with `pin: true`
- **DO NOT** apply external pinning from ScrollManager
- Cards slide right-to-left with arc effect (scale/opacity/rotation)

### ShowcaseStack.tsx
- **Internal Vertical Stack:** 5 sections (Academy → DigitalStage)
- **Pinned Scroll:** `start: "top top"`, `end: "+=${sections.length * 100}%`
- **onCompletion Callback:** Signals when animation finishes
- **DO NOT** apply external ScrollManager animations

### Instructors.tsx
- **Visibility:** Hidden until ShowcaseStack completes
- **Internal Scroll:** Title parallax on scroll
- **Interactive Cards:** 50/50 split grid with cursor tracking

### BrandGallery.tsx
- **Overlay:** `bg-black/40` (no blur - images must be sharp)
- **Title Font:** `font-syne uppercase font-black tracking-[-0.02em]` (same as Hero)
- **Responsive:** `text-3xl md:text-5xl lg:text-6xl`
- **Layout:** 3x3 grid from galleryItems (9 items)

### Contact.tsx
- **Sticky:** `sticky top-0 h-screen`
- **Visibility:** Managed by ScrollManager (z-index + Instructors state)
- **Internal Animations:** Unveil effect + parallax + marquee

---

## CDN URL Helpers (src/lib/constants.ts)

```typescript
getInstructorImageUrl(filename: string)  // /images/instructor/
getGalleryImageUrl(filename: string)     // /images/gallery/
getHeroImageUrl(filename: string)        // /images/hero/
```

## Data Layer Pattern

```typescript
// src/data/*.ts files
export interface X { ... }
export const xItems: X[] = [...]
```

Files: `instructor.ts`, `gallery.ts`, `hero.ts`

---

## Interaction Rules

1. **Plan Mode:** Always propose a plan before major architectural changes
2. **Append-Only:** Add new instructions to end of this file (preserve prefix caching)
3. **Build Verification:** Run `npm run build` after significant changes
4. **Type Safety:** All components must have proper TypeScript interfaces

---

## Session History (Append New Sessions Here)

### 17 Şubat 2026 - ScrollManager Cleanup & BrandGallery i18n
- Removed all ScrollTrigger animations from ScrollManager
- BrandGallery now has overlay title with i18n support
- Gallery expanded to 9 items (timeright-images-09.webp added)
- Font sizes reduced for better proportion (text-3xl/5xl/6xl)
