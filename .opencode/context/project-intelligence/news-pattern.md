<!-- Context: project-intelligence/news-pattern | Priority: high | Version: 1.0 | Updated: 2026-09-01 -->

# News / Press Content Pattern

> How news/press content is structured, routed, and rendered in the project.

## Quick Reference

- **Purpose**: News content must separate technical data from translated display content
- **Update When**: Adding news items, modifying news routing, changing CDN structure
- **Audience**: Developers, content editors

## Data vs. Translations

### Technical data (`src/data/news.ts`)

Store only:
- `id`, category key, media type
- Image filenames, gallery image filenames
- `youtubeId` (when applicable), `featured` flag
- External source URLs and source names

Do **not** store: titles, excerpts, locations, button labels, translated category labels.

### Translations (`src/messages/{tr,en}.json`)

News display text lives under:
- `news.categories`
- `news.items[newsItemId]`
- `newsDetail`

Both locale files must be updated whenever a news item is added or edited.

## Routing

Detail pages: `src/app/[locale]/news/[slug]/page.tsx`

- `/tr/news/{newsItemId}`
- `/en/news/{newsItemId}`

`generateStaticParams()` uses `newsItems` and `item.id`. Unknown IDs return `notFound()`.

## Navigation

BrandGallery news cards link to localized detail pages. External sources open in a new tab with `rel="noopener noreferrer"`.

## CDN

Use `getNewsImageUrl()` from `src/lib/constants.ts`. Asset path: `images/news/askin-ozanlari/{filename}`.

Never hardcode CDN URLs in components.

## New Item Workflow

1. Upload images to CDN/R2
2. Add metadata to `src/data/news.ts`
3. Add Turkish content to `src/messages/tr.json`
4. Add English content to `src/messages/en.json`
5. Do not modify React components
6. Run `npm run build`

## 📂 Codebase References

**Implementation**:
- `src/data/news.ts` — News metadata
- `src/messages/{tr,en}.json` — Localized news text
- `src/app/[locale]/news/[slug]/page.tsx` — Detail page
- `src/lib/constants.ts` — CDN URL helpers

**Related Files**:
- `technical-domain.md` — Stack and architecture
- `business-domain.md` — Business context
