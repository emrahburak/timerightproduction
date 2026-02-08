'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function IntroOverlay() {
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsComplete(true),
    });

    // Initial States
    // Logo opacity is handled by CSS (opacity-0) until GSAP takes over
    gsap.set(logoRef.current, { scale: 1.5 });
    // Beam starts hidden (opacity 0) and at the bottom edge
    gsap.set(beamRef.current, { top: '100%', opacity: 0 });

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

  }, { scope: containerRef });

  if (isComplete) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Black Background (The Curtain) */}
      <div
        id="curtain"
        className="absolute inset-0 bg-black z-0"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      />

      {/* Light Beam - Positioned above the curtain */}
      <div
        ref={beamRef}
        className="absolute left-0 w-full h-[600px] z-20 blur-md pointer-events-none mix-blend-screen opacity-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0) 30%, rgba(236, 72, 153, 1) 45%, #ffffff 50%, rgba(236, 72, 153, 1) 55%, rgba(236, 72, 153, 0) 70%, transparent 100%)',
          top: '100%'
        }}
      />

      {/* Logo Container */}
      <div className="relative z-10 w-[720px] max-w-[90vw] aspect-square">
        <Image
          ref={logoRef}
          src="/timeright.png"
          alt="Time Right Production"
          fill
          className="object-contain object-center scale-150 opacity-0"
          priority
        />
      </div>
    </div>
  );
}
