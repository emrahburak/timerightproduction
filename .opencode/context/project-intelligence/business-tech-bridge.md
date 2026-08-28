<!-- Context: project-intelligence/bridge | Priority: high | Version: 2.0 | Updated: 2026-08-28 -->

# Business ↔ Tech Bridge

> How business needs translate to technical solutions for Time Right Production.

## Quick Reference

- **Purpose**: Show stakeholders technical choices serve business goals; show developers business constraints drive architecture
- **Update When**: New features, refactoring, business pivot

## Core Mapping

| Business Need | Technical Solution | Why This Mapping | Business Value |
|---------------|-------------------|------------------|----------------|
| Workshop enrollment | `/api/apply`, `/api/register`, course data, localized messages, application UI | Server-side processing with email and data persistence | Applications and registrations captured for business follow-up |
| Registration management | `/api/register`, rate limiting, duplicate checks, Google Sheets, optional Resend notifications | Server-only integration with persistence and bot protection | Scalable data collection for business operations |
| Multi-language audience | `[locale]` routing, `tr`/`en` message files, locale-specific SEO | Manual i18n for full control | Content presented to Turkish-speaking and English-speaking audiences |
| Visual storytelling | Project photography, video, production showcases, news, editorial content via data-driven sections | Scalable, responsive structure compatible with existing visual identity | Growing content area supports brand and portfolio presentation |
| Course discovery | Course data, localized course content, academy/showcase sections, application UI | Structured data with localized presentation | Users find and inquire about courses |
| Production portfolio visibility | Theatre, film, documentary, promotional film, festival content via scalable structures | Maintainable presentation for growing project work | Communicates current work to clients, partners, and audiences |
| News and project updates | Maintainable structure for announcements, production news, event updates, visual content | Data-driven, responsive, compatible with visual identity | New projects and updates can be published without redesign |
| Service discovery | Acting, diction, speaking, theatre, film, casting, management, rhythm, festival, music via localized sections | Reusable, structured content presentation | Visitors identify appropriate services |
| Lead generation | Content sections connected to application, registration, and contact flows | Clear paths from discovery to action | Visitors move from content to business actions |
| International collaboration | Flexible content for Istanbul, Netherlands, Switzerland, Berlin activities | Content structures avoid fixed assumptions about participants or profiles | Activities presented without generalizing participant or artist profiles |

## Feature Mapping Examples

### Feature: Course Application System

**Business Context**:
- User need: Apply for acting, diction, speaking, rhythm workshops
- Business goal: Capture applications and registrations for business follow-up
- Priority: Core service offering

**Technical Implementation**:
- Solution: `/api/apply` sends application to admin email via Resend when configured; `/api/register` stores data in Google Sheets with optional admin notification
- Architecture: Server-only endpoints, rate limiting, honeypot, duplicate checks
- Trade-offs: Google Sheets as current data store; migration only if explicitly required

**Connection**:
These integrations support active events or registration periods. The public registration form may be disabled after an event or registration period ends. The integrations may remain in the codebase but should not be considered continuously active. They can be reactivated for a future event or registration period.

---

### Feature: Multi-language Content

**Business Context**:
- User need: Turkish-speaking and English-speaking audiences need localized content
- Business goal: Present content to both language groups
- Priority: Existing architecture, must remain synchronized

**Technical Implementation**:
- Solution: Manual `[locale]` routing with separate message files for `tr` and `en`
- Architecture: Static generation, locale-specific SEO as a technical capability
- Trade-offs: Manual i18n preserved unless migration is approved; both locales synchronized

**Connection**:
Content is presented in both supported languages; locale-specific SEO is a technical capability, not a guaranteed business outcome.

---

### Feature: Visual Portfolio and News

**Business Context**:
- User need: View project photography, production updates, event information, news content
- Business goal: Growing content area for portfolio and brand presentation
- Priority: Scalable structure needed as content grows

**Technical Implementation**:
- Solution: Data-driven, responsive, maintainable sections compatible with existing visual identity
- Architecture: CDN-served media, structured content; no CMS currently exists
- Trade-offs: New media addable without complete page redesign; existing color palette preserved

**Connection**:
Growing content needs a scalable presentation structure that adapts to the current design language rather than replacing it.

---

### Feature: Service Discovery

**Business Context**:
- User need: Understand education, production, casting, event, rhythm, and music services
- Business goal: Help visitors identify appropriate services
- Technical Direction: Localized, reusable sections with structured content data

**Connection**:
Clear service presentation helps visitors identify the appropriate service and take the next contact, application, or registration action.

---

### Feature: Production Portfolio and Project Updates

**Business Context**:
- User need: See theatre, film, documentary, promotional film, festival, and other creative work
- Business goal: Communicate current work to potential clients, partners, and audiences
- Technical Direction: Scalable content and media structures for photography, videos, descriptions, updates

**Connection**:
A maintainable portfolio presentation can communicate current work as new projects become available.

---

### Feature: Casting and Talent Management

**Business Context**:
- User need: Understand casting and management as part of creative services
- Business goal: Present these services clearly without assuming fixed participant or artist profiles
- Technical Direction: Clear content presentation within broader service structure

**Connection**:
Visitors and potential partners can understand the role of casting and management within the company's broader services.

---

### Feature: Rhythm and Corporate Workshop Services

**Business Context**:
- User need: Discover rhythm ateliers and corporate motivation workshops
- Business goal: Serve different audiences with distinct workshop formats
- Technical Direction: Distinct content and inquiry paths alongside acting and other workshops

**Connection**:
Different audiences can discover and inquire about the workshop format relevant to their needs.

---

### Feature: Lead Generation and Contact

**Business Context**:
- User need: Make applications, registrations, or inquiries
- Business goal: Convert interest into business actions
- Technical Direction: Connect content sections to existing application, registration, and contact flows

**Connection**:
Application, registration, and contact flows may be enabled or disabled depending on the relevant service or event period.

## Trade-off Decisions

| Situation | Business Priority | Technical Priority | Decision Made | Rationale |
|-----------|-------------------|-------------------|---------------|-----------|
| Static content vs CMS | Easy content updates | Repository-controlled simplicity | Static data for now | Maintainable without assuming CMS exists |
| Google Sheets vs database | Data scalability | No infrastructure overhead | Keep Google Sheets | Event-based activation; not assumed continuously active |
| Manual i18n vs library | Full control | Simplicity | Preserve manual i18n | Both locales must remain synchronized |
| Visual identity vs new content | Brand consistency | Scalable presentation | Adapt, don't replace | Preserve established colors and design language |
| Animation vs performance | Cinematic experience | Accessibility and speed | Enhance, don't reduce | Avoid unnecessary client-side JS |
| Flexible services vs fixed assumptions | Varying project profiles | Content flexibility | Flexible structures | Do not generalize participant or artist profiles |

## Business Constraints

- Registration forms and related integrations are activated for specific events or registration periods and may be disabled afterward until a future event
- Resend and Google Sheets should not be assumed to be continuously active business operations
- Projects organized across Netherlands, Switzerland, Berlin, and Istanbul
- Educational programs delivered periodically, not limited to single seasonal schedule
- Theatre and film productions depend on suitable projects and available partners
- In international co-productions, larger production share leads organization
- Participant and artist profiles vary by project — should not be generalized
- Pricing is not fixed — custom proposals per project scope and conditions

## 📂 Codebase References

**Implementation**:
- `src/app/api/apply/route.ts` — Course application endpoint (event-specific)
- `src/app/api/register/route.ts` — Registration with Google Sheets (event-specific)
- `src/app/[locale]/` — Locale routing structure
- `src/messages/{tr,en}.json` — Localized content
- `src/data/` — Static content data
- `src/components/sections/` — Existing page sections; possible future location for scalable portfolio or news presentation
- `src/lib/constants.ts` — CDN URL helpers
- `src/lib/seo.ts` — Locale-specific SEO

## Related Files

- `business-domain.md` - Business needs in detail
- `technical-domain.md` - Technical implementation in detail
- `decisions-log.md` - Decisions made with full context
