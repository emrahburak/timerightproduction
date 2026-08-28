<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-08-28 -->

# Technical Domain

> Tech stack, architecture, and development patterns for Time Right Production.

## Quick Reference

- **Purpose**: Understand how the project works technically
- **Update When**: Tech stack changes, new patterns, architecture decisions
- **Audience**: Developers, AI agents

## Primary Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js | 16.x | App Router, SSR/SSG, locale routing, SEO, image optimization |
| Language | TypeScript | 5.x | Strict mode, full type safety |
| Styling | Tailwind CSS | 4.x | Utility-first, responsive, existing design system |
| Animations | GSAP + Framer Motion + Lenis | — | Smooth scroll, scroll-triggered animations, transitions |
| Icons | FontAwesome + Lucide React | — | Icon libraries |
| Email | Resend | — | Application/registration email notifications |
| Data Store | Google Sheets | — | Registration data via server-side google-auth-library |
| Node | — | 22.13.0 | Runtime requirement |

## Architecture

```
Type: Static-first with server components
Pattern: Next.js App Router with manual i18n (tr/en)
Locale: src/app/[locale]/ — dynamicParams = false (static gen)
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirects / → /tr
│   ├── [locale]/
│   │   ├── layout.tsx          # Fonts, SEO, ModalProvider, Header, SmoothScroll
│   │   ├── page.tsx            # HomePage
│   │   └── privacy/            # Privacy page
│   └── api/
│       ├── apply/route.ts      # Course application → Resend email
│       └── register/route.ts   # Registration → Google Sheets + email
├── components/
│   ├── sections/               # Page sections (About, Services, Contact)
│   ├── ui/                     # Reusable UI (ChatField, Modal, VideoPlayer)
│   └── *.tsx                   # Top-level (Header, Hero, Navbar)
├── contexts/ModalContext.tsx    # Modal state management
├── data/                       # Static content (TS files + courses.json)
├── lib/
│   ├── constants.ts            # CDN URL helpers
│   └── seo.ts                  # SEO config per locale
└── messages/                   # i18n JSON (en.json, tr.json)
```

## Code Patterns

### API Endpoint

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, kvkk, courseTitle } = body;

    if (!name || !phone || !kvkk) {
      return NextResponse.json(
        { error: "Ad, Telefon ve KVKK onayı zorunludur." },
        { status: 400 }
      );
    }

    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({ /* ... */ });
      if (error) {
        return NextResponse.json({ error: "Mail gönderim hatası" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Form gönderilemedi." }, { status: 500 });
  }
}
```

### Component

```typescript
"use client";
import React, { useState } from "react";

interface ServiceListItemProps {
  service: { id: number; title: string; titleEn: string; icon: string };
}

export default function ServiceListItem({ service }: ServiceListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="...">
      {/* Tailwind utility classes, responsive, glassmorphism */}
    </div>
  );
}
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `ServiceListItem.tsx` |
| Next.js special files | lowercase | `page.tsx`, `layout.tsx`, `route.ts` |
| API directories | lowercase | `apply/`, `register/` |
| Lib/utility files | lowercase/camelCase | `constants.ts`, `google-sheets.ts` |
| Components | PascalCase | `ServiceListItem` |
| Props interfaces | PascalCase + Props | `ServiceListItemProps` |
| Functions/variables | camelCase | `setIsOpen`, `handleClick` |
| Boolean state | is/has/should prefix | `isOpen`, `hasError` |

## Code Standards

- TypeScript strict mode — preserve type safety throughout
- Server Components by default; `"use client"` only for state, events, browser APIs
- Follow Next.js App Router conventions (pages, layouts, routes, metadata, static gen)
- Keep static content in `src/data/`, localized text in `src/messages/{tr,en}.json`
- Use `@/*` path alias for imports from `src/`
- Use Syne (headings), Cormorant Garamond (editorial), Archivo (interface)
- Use CDN helpers from `src/lib/constants.ts` — never hardcode asset URLs
- Preserve existing GSAP, Framer Motion, Lenis animation patterns
- Keep components focused, reusable, responsive, semantic, accessible
- Run `npm run lint` and `npm run build` after changes (no test framework configured)

## Security Requirements

- Validate and normalize all user-controlled input server-side before processing
- Never expose API keys, credentials, or secrets to client-side code
- Read secrets only from server-side env vars (RESEND_API_KEY, GOOGLE_SHEET_ID, etc.)
- Protect form endpoints with rate limiting and honeypot bot detection
- Prevent duplicate registrations before writing to Google Sheets
- Respect KVKK consent — treat application/registration data as personal data
- Do not collect personal information beyond what is necessary for the service
- Return generic error messages to users; log diagnostics server-side only
- Escape user-provided values in email HTML to prevent injection
- Keep Google Sheets and Resend integrations server-only
- Use HTTPS in production; never commit secrets to the repository

## 📂 Codebase References

**Implementation**:
- `src/app/api/apply/route.ts` — Course application API pattern
- `src/app/api/register/route.ts` — Registration API with rate limiting, honeypot, Google Sheets
- `src/components/sections/` — Section component patterns
- `src/components/ui/` — Reusable UI component patterns
- `src/lib/constants.ts` — CDN URL helpers
- `src/lib/seo.ts` — SEO configuration
- `src/messages/{tr,en}.json` — i18n translation files
- `src/data/` — Static content data

**Config**: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`

## Related Files

- `business-domain.md` — Business context and problem statement
- `business-tech-bridge.md` — How business needs map to technical solutions
- `decisions-log.md` — Major decisions with rationale
