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
    gsap.set(logoRef.current, { opacity: 0 });
    // Beam starts well below the screen
    gsap.set(beamRef.current, { top: '110%', opacity: 0 }); 

    // STEP 1: Fade In Logo (Slower: 2s)
    tl.to(logoRef.current, { 
      opacity: 1, 
      duration: 2, 
      ease: 'power2.inOut' 
    });

    // STEP 2: The Shine (Light Beam)
    // First, make it visible
    tl.to(beamRef.current, {
      opacity: 1,
      duration: 0.1, 
    }, "-=1"); // Start well before logo fade finishes (overlap)

    // Then move it from bottom to top of the SCREEN
    tl.to(beamRef.current, { 
      top: '-50%', // Changed from '-20%' to '-50%' (ARCH.md Instruction 2)
      duration: 1.5, 
      ease: 'power2.inOut',
    }, "<");

    // STEP 3: Exit (0.8s)
    tl.to(containerRef.current, { 
      opacity: 0, 
      duration: 0.8, 
      ease: 'power2.inOut',
      pointerEvents: 'none' 
    });

  }, { scope: containerRef });

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Light Beam - Moved OUTSIDE the logo container, direct child of fixed overlay */}
      <div 
        ref={beamRef}
        // Changed h-32 to h-[30rem], blur-2xl to blur-3xl, mix-blend-overlay to mix-blend-screen (ARCH.md Instruction 1)
        className="absolute left-0 w-full h-[30rem] z-20 blur-3xl pointer-events-none mix-blend-screen"
        style={{
          // Updated gradient style (ARCH.md Instruction 1)
          background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.8) 40%, #ffffff 50%, rgba(236, 72, 153, 0.8) 60%, transparent 100%)' 
        }}
      />

      {/* Logo Container */}
      <div className="relative z-10 w-[720px] max-w-[90vw] aspect-square">
        <Image
          ref={logoRef}
          src="/timeright.png"
          alt="Time Right Production"
          fill
          className="object-contain object-center scale-150"
          priority
        />
      </div>
    </div>
  );
}
