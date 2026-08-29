<!-- Context: project-intelligence/visual-design | Priority: high | Version: 1.0 | Updated: 2026-08-28 -->

# Visual Design

> Color, typography, layout, glassmorphism, motion, and asset rules for Time Right Production.

## Quick Reference

- **Purpose**: Preserve visual identity and design system across all UI work
- **Update When**: New sections, style changes, animation additions, asset path changes
- **Audience**: Developers, AI agents building UI

## Color Palette & Surface Hierarchy

| Surface | Value | Usage |
|---------|-------|-------|
| Background deep | `#0a0a0a` | Hero, About sections |
| Background base | `#141414` | Body, Services, general |
| Foreground | `#ededed` | Body text, UI elements |
| Pure white | `#FFFFFF` | Headings, high-emphasis text |
| Glass low | `bg-white/5` | Card backgrounds, inactive states |
| Glass mid | `bg-white/10` | Active cards, hover states, buttons |
| Glass border | `border-white/10` | Card borders, dividers |
| Glass border active | `border-white/20` | Focused/hovered elements |
| Accent blue | `blue-500/20`, `blue-400` | Badges, pills, indicators |
| Accent green | `green-500/20`, `green-400` | Success states |
| Accent gradient | `from-blue-500 to-purple-500` | Top accent bars, highlights |

**Rule**: Never use pure black (`#000000`) for backgrounds — use `#0a0a0a` or `#141414`. Reserve `#000000` for theme-color meta only.

## Typography Roles

| Role | Font | Variable | Usage |
|------|------|----------|-------|
| Heading | Syne | `--font-syne` | Section titles, nav, buttons |
| Editorial | Cormorant Garamond | `--font-cormorant-garamond` | Descriptions, body prose |
| Interface | Archivo | `--font-archivo` | Default body, forms, labels |

**Patterns**:
- Headings: `font-syne uppercase font-black tracking-[-0.02em]`
- Body: `font-cormorant text-white/80 leading-relaxed`
- Fluid sizing: `text-[clamp(1.25rem,2.2vw,1.85rem)]`

## Layout & Spacing

```
Container:    container mx-auto px-6
Section:      min-h-screen py-24 (or py-16 mobile)
Grid:         grid-cols-1 md:grid-cols-2 gap-12
Max width:    max-w-5xl (content), max-w-7xl (wide)
```

**Responsive**: Mobile-first with `md:` and `lg:` breakpoints. Use `clamp()` for fluid typography.

## Glassmorphism & Grain Treatment

**Glass card pattern**:
```
bg-white/5 backdrop-blur-md border border-white/10
shadow-[0_4px_24px_rgba(0,0,0,0.3)] rounded-2xl
hover:bg-white/10 transition-all duration-500
```

**Grain overlay** (body):
```css
background-image: var(--grainy-overlay); /* SVG noise filter */
background-size: 200px;
background-repeat: repeat;
```

**Gradient overlays** (section transitions):
```
bg-gradient-to-b from-[#0a0a0a] to-transparent   /* top fade */
bg-gradient-to-t from-[#0a0a0a] to-transparent   /* bottom fade */
```

## Animation & Motion Principles

| Tool | Use Case |
|------|----------|
| GSAP + ScrollTrigger | Scroll-triggered reveals, parallax, marquee |
| Framer Motion | Modal enter/exit, AnimatePresence |
| Lenis | Smooth scroll |
| CSS | `animate-pulse`, `animate-spin`, `fadeIn` keyframe |

**GSAP patterns**: Character stagger (`stagger: 0.018`), scroll scrub (`scrub: 1`), opacity + y transforms.

**Framer Motion**: `initial/animate/exit` with scale + opacity + y for modals.

## Image & CDN Asset Rules

**Base**: `https://cdn.timerightproduction.org`

**Always use helpers from `src/lib/constants.ts`**:
- `getHeroImageUrl()`, `getAboutImageUrl()`, `getServiceImageUrl()`
- `getInstructorImageUrl()`, `getGalleryImageUrl()`, `getVideoUrl()`
- `getShowcaseStackUrl()`, `getThumbnailImageUrl()`, `getWorkshopImageUrl()`

**Never hardcode CDN paths.** Fallback: `/placeholder-thumbnail.webp`

**next/image**: Use `fill` + `object-cover`/`object-contain`, define `sizes`.

## Reusable Section Patterns

- **Hero**: Full-screen, bg-[#0a0a0a], image fill + opacity, marquee, gradient fade bottom
- **About**: 2-col grid, character-reveal title, parallax image
- **Services**: Stacked accordion cards, glassmorphism, background watermark text at 3% opacity
- **Modals**: Portal, backdrop-blur, Framer Motion animate, scroll lock

## Design Decisions to Preserve

- Dark-first aesthetic — no light mode
- Glassmorphism over solid surfaces
- Grain texture on all pages
- Syne uppercase for headings, Cormorant for prose
- GSAP for scroll animations, Framer Motion for UI transitions
- All assets via CDN helpers, never hardcoded

## 📂 Codebase References

- `src/app/globals.css` — CSS variables, grain overlay, typography defaults
- `tailwind.config.ts` — Font families, colors, keyframes
- `src/app/[locale]/layout.tsx` — Font loading (Syne, Cormorant, Archivo)
- `src/lib/constants.ts` — CDN URL helpers
- `src/components/Hero.tsx` — Hero section, marquee, GSAP animations
- `src/components/sections/About.tsx` — 2-col layout, character reveal, parallax
- `src/components/sections/Services.tsx` — Accordion list, watermark text
- `src/components/sections/ServiceListItem.tsx` — Glassmorphism card pattern
- `src/components/ui/CourseApplicationModal.tsx` — Modal, Framer Motion, form UI

## Related Files

- `technical-domain.md` — Tech stack and API patterns
- `business-domain.md` — Brand identity context
