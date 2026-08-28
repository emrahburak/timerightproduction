<!-- Context: project-intelligence/business | Priority: high | Version: 2.0 | Updated: 2026-08-28 -->

# Business Domain

> Business context, problems solved, and value created by Time Right Production.

## Quick Reference

- **Purpose**: Understand why this project exists
- **Update When**: Business direction changes, new features shipped, pivot
- **Audience**: Developers needing context, stakeholders, product team

## Project Identity

```
Project Name: Time Right Production
Tagline: A creative production company working across acting, film, theatre, casting, rhythm workshops, and cultural events.
Problem Statement: The creative sector needs accessible ways for people to gain experience in front-of-camera acting, diction, effective speaking, and rhythm-based performance activities. It also needs support for developing and producing theatre and film projects, discovering new talent, managing casting and representation, promoting productions, and organizing cultural events.
Solution: Time Right Production develops and delivers creative, educational, and production services across acting education, diction and effective speaking training, theatre productions, corporate promotional films, documentary films, festival organization, talent and casting management services, corporate rhythm-based motivation workshops, and music for film and theatre productions.
```

## Target Users

| User Segment | Who They Are | What They Need | Pain Points |
|--------------|--------------|----------------|-------------|
| Primary | People who want to explore acting, gain camera experience, or participate in workshops | Accessible workshop environment, practical skill development, experience through creative projects | Limited access to beginner-friendly acting opportunities |
| Secondary | Theatre/film partners, producers, corporate clients, cultural organizations, event organizers | Production services, casting/talent management, co-production opportunities, festival support | Need reliable creative production partner |

## Value Proposition

**For Users (participants):**
- Explore acting in accessible workshop environment, especially for beginners
- Develop practical skills in acting, diction, effective speaking, and rhythm
- Gain experience through workshops and creative projects
- Participate in educational programs connected to productions and events

**For Business (partners/clients):**
- Access complete production services through one creative company
- Collaborate on theatre and film projects, including international co-productions
- Receive support with festivals, marketing, documentary production, cultural events
- Work with company combining production, education, and music services

## Business Model

```
Revenue Model: Multiple streams depending on service
- Workshop fees (acting, diction, speaking, rhythm)
- Project-based production contracts (theatre, film, documentary, promotional)
- Festival and event organization fees
- Corporate rhythm workshop fees
- Paid film and theatre music services
- Casting and talent management fees/commissions

Pricing Strategy: Custom quotes based on scope, duration, participants, requirements
Key Revenue Streams: Workshops, productions, events, corporate, music, casting/management
```

## Success Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Workshop enrollment | Participants registering for workshops | — | — |
| Capacity utilization | How fully workshops reach capacity | — | — |
| Participant satisfaction | Feedback from participants | — | — |
| Repeat participation | Returning participants | — | — |
| Project completion | Completed theatre/film/documentary projects | — | — |
| Revenue by service line | Revenue per service category | — | — |
| Website conversion | Inquiries and completed applications | — | — |

## Business Constraints

- Projects organized across Netherlands, Switzerland, Berlin, and Istanbul
- Educational programs delivered periodically, not limited to single seasonal schedule
- Theatre and film productions depend on suitable projects and available partners
- In international co-productions, larger production share leads organization
- Participant and artist profiles vary by project — should not be generalized
- Pricing is not fixed — custom proposals per project scope and conditions

## Onboarding Checklist

- [ ] Understand the problem statement
- [ ] Identify target users and their needs
- [ ] Know the key value proposition
- [ ] Understand success metrics
- [ ] Know who the stakeholders are
- [ ] Understand current business constraints

## 📂 Codebase References

**Implementation**:
- `src/app/[locale]/page.tsx` — HomePage showcasing services
- `src/components/sections/` — Section components (About, Services, Contact)
- `src/data/courses.json` — Course/workshop data
- `src/app/api/apply/route.ts` — Course application endpoint
- `src/app/api/register/route.ts` — Registration endpoint

## Related Files

- `technical-domain.md` - How this business need is solved technically
- `business-tech-bridge.md` - Mapping between business and technical
- `decisions-log.md` - Business decisions with context
