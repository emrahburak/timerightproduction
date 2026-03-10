# AGENTS.md - Development Guidelines for timerightproduction.org

## Project Overview

This is a Next.js 16 multi-language website for Time Right Production built with React 19, TypeScript, and Tailwind CSS v4. The site supports both English (en) and Turkish (tr) locales and uses Next.js App Router.

## Build Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Production build using Next.js build |
| `npm run start` | Start production server (run after build) |
| `npm run lint` | Run ESLint on entire codebase |

### Running a Single Test

This project does not currently have a test framework configured. If tests are added in the future, typical commands would be:
- `npm run test` - Run all tests
- `npm run test -- --testNamePattern="test name"` - Run specific test
- `npm run test -- fileName` - Run tests in specific file

### Type Checking

TypeScript is configured with strict mode enabled. Type checking happens automatically during build. For explicit type checking:
- The build command includes type checking via `next build`
- Use `npx tsc --noEmit` to check types without building

## Code Style Guidelines

### TypeScript

- **Strict Mode**: Always enabled. No implicit `any` types.
- **Type Inference**: Use inference where types are obvious, but be explicit with function parameters and props.
- **Interfaces vs Types**: Use interfaces for component props and object shapes that may be extended. Use types for unions, intersections, and primitives.
- **Async/Await**: Prefer async/await over raw Promises.
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`) instead of explicit checks where appropriate.

### React Components

- **File Naming**: Use PascalCase for components (e.g., `Header.tsx`, `Hero.tsx`).
- **Component Structure**:
  1. Imports (external first, then internal)
  2. Types/Interfaces
  3. Helper functions
  4. Main component export
- **Client vs Server Components**: Mark components as `'use client'` only when they need client-side features (hooks, event handlers, browser APIs).
- **Props**: Define explicit interfaces for component props.

### Imports and Paths

- **Path Alias**: Use `@/*` for imports from `src/` directory (configured in tsconfig.json).
- **Import Order**:
  1. React/Next.js imports
  2. External library imports
  3. Internal component imports
  4. Asset/style imports
- **Named Imports**: Use named imports for React hooks and Next.js features.

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ClientHeaderContent` |
| Files | kebab-case for non-components, PascalCase for components | `smooth-scroll.tsx`, `Header.tsx` |
| Variables/Constants | camelCase | `isLoading`, `navLinks` |
| Types/Interfaces | PascalCase | `HeaderProps`, `NavLink` |
| CSS Variables | kebab-case with double dashes | `--font-syne` |
| Locale Codes | ISO 639-1 (2 letters) | `en`, `tr` |

### Error Handling

- **Try/Catch**: Wrap async operations that may fail.
- **Error Boundaries**: Let errors propagate to nearest error boundary rather than catching silently.
- **Logging**: Use `console.error` for errors, avoid `console.log` in production code.
- **User Feedback**: Provide fallback UI when content fails to load.

### Tailwind CSS v4

- **Custom Colors**: Define in `tailwind.config.ts` under `theme.extend.colors`. Currently defined: `pure-black`, `pure-white`.
- **Custom Fonts**: Define font families as CSS variables in the layout and configure in `tailwind.config.ts`.
- **Utility Classes**: Use Tailwind utilities for styling. Avoid custom CSS where utilities suffice.
- **Arbitrary Values**: Use sparingly; prefer adding to theme config.

### Next.js App Router Patterns

- **Dynamic Routes**: Use `[locale]` folder for i18n routing.
- **Static Params**: Use `generateStaticParams` for static routes (see `src/app/[locale]/layout.tsx`).
- **Async Components**: Server components can be async for data fetching.
- **Font Optimization**: Use `next/font/google` for optimized fonts (see layout.tsx).

### Internationalization (i18n)

- **Locale Files**: JSON files in `src/messages/` directory (`en.json`, `tr.json`).
- **Message Loading**: Use dynamic imports with error handling (see `src/components/Header.tsx`).
- **Supported Locales**: `['en', 'tr']` with fallback to English.
- **Route Structure**: All localized pages go under `src/app/[locale]/`.

### Image Handling

- **Configuration**: External image domains configured in `next.config.ts`:
  - `images.unsplash.com`
  - `timerightproduction.org`
- **Recommendation**: Use Next.js `<Image>` component for optimized images.

### ESLint Configuration

- **Config File**: `eslint.config.mjs`
- **Extends**: `eslint-config-next` with TypeScript support
- **Ignored Paths**: `.next/`, `build/`, `out/`, `next-env.d.ts`
- **Run Lint**: Always run `npm run lint` before committing

### File Structure

```
src/
├── app/
│   ├── [locale]/          # i18n routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── sections/          # Page sections
│   ├── Client*.tsx        # Client components
│   └── *.tsx              # Shared components
├── messages/              # i18n JSON files
├── proxy.ts               # Proxy configuration
└── styles/                # Global styles
```

### Recommended VS Code Extensions

- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (works for TSX)
- Prettier (disable default formatter, use ESLint)

### Pre-commit Checks

Before committing, ensure:
1. Code passes `npm run lint`
2. Build succeeds (`npm run build`)
3. No TypeScript errors
4. No console.error calls in production paths

### Common Patterns

**Client Component with Server Parent**:
```tsx
// Header.tsx (Server Component)
import ClientHeaderContent from './ClientHeaderContent';
export default async function Header({ locale }: HeaderProps) {
  const messages = await getMessages(locale);
  return <ClientHeaderContent navLinks={messages.navbar} locale={locale} />;
}
```

**Locale-aware Layout**:
```tsx
// [locale]/layout.tsx
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }];
}
```

**Error Handling with Fallback**:
```tsx
try {
  const messages = (await import(`@/messages/${targetLocale}.json`)).default;
  return messages;
} catch (error) {
  console.error(...);
  return (await import('@/messages/en.json')).default;
}
```
