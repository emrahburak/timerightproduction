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
    gsap.set(logoRef.current, { opacity: 0, scale: 1.5 });
    // ARCH.md Instruction 2: Beam starts hidden (opacity 0) and off-screen (top 110%)
    gsap.set(beamRef.current, { top: '110%', opacity: 0 }); 

    // STEP 1: Logo Pulse (In -> Hold -> Out)
    tl.to(logoRef.current, { 
      opacity: 1, 
      duration: 1.5, 
      ease: 'power2.inOut' 
    })
    .to(logoRef.current, { 
      opacity: 0, 
      duration: 1.0, 
      ease: 'power2.inOut' 
    }, "+=0.2"); // Hold 0.2s

    // STEP 2: Sharp Beam Scan (Starts AFTER Logo is gone)
    tl.to(beamRef.current, { 
      opacity: 1,      // ARCH.md Instruction 3: Make visible when movement starts
      top: '-50%', 
      duration: 1.2, 
      ease: 'power4.out', // Faster and sharper movement
    });

    // STEP 3: Exit Overlay
    tl.to(containerRef.current, { 
      opacity: 0, 
      duration: 0.5, // Reduced duration
      pointerEvents: 'none' 
    });

  }, { scope: containerRef });

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Light Beam - Updated styling for sharpness */}
      <div 
        ref={beamRef}
        // ARCH.md Instruction 1: Added opacity-0 to hide beam until GSAP takes over
        className="absolute left-0 w-full h-[400px] z-20 blur-md pointer-events-none mix-blend-screen opacity-0"
        style={{
          // Updated gradient style for sharper transitions
          background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.9) 20%, #ffffff 50%, rgba(236, 72, 153, 0.9) 80%, transparent 100%)' 
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
