# ARCH.md - Animation Timing & Overlap Fix

> **Aider/Developer:** Apply these refinements to `/home/elkasar/Genel/repo/timerightproduction.org/src/components/IntroOverlay.tsx`
> **CRITICAL:** Output only valid TSX code. NO markdown backticks in the final file.

## Objective
Eliminate the 1-second delay between the logo fading out and the beam starting. Ensure a high-tempo, seamless transition.

## Technical Instructions

### 1. Timing Refinement (GSAP)
**File:** `/home/elkasar/Genel/repo/timerightproduction.org/src/components/IntroOverlay.tsx`

Modify the `useGSAP` timeline logic:
- **Logo Exit:** Change `duration: 0.5` to `duration: 0.3`.
- **Beam Start Offset:** Change `">"` (wait for end) to `"-=0.3"` (start during the fade-out).
- **Beam Duration:** Slightly decrease to `2.2` for better pace.

```typescript
// STEP 1: Faster Logo Exit
tl.to(logoRef.current, { 
  opacity: 1, 
  duration: 0.8, 
  ease: 'power2.out' 
})
.to(logoRef.current, { 
  opacity: 0, 
  duration: 0.3, // Faster exit
  ease: 'power2.in' 
}, "+=0.1");

// STEP 2: Immediate Overlapping Reveal
tl.to(beamRef.current, {
  opacity: 1,
  top: '-110%', 
  duration: 2.2,
  ease: 'power4.inOut',
}, "-=0.3") // OVERLAP: Start as the logo is fading out
.to("#curtain", {
  clipPath: 'inset(0% 0% 100% 0%)', 
  duration: 2.2,
  ease: 'power4.inOut',
}, "<"); // Stay synced with beam
```

### 2. Initial State Check
Ensure the beam starts at `top: '100%'` or `top: '110%'` in the `gsap.set` or initial styles so it comes from below the screen.

```typescript
// Initial States
gsap.set(logoRef.current, { scale: 1.5 }); 
gsap.set(beamRef.current, { top: '100%', opacity: 0 }); // Ensure it starts at the bottom
```
