'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react'; // Enabled for animation
import gsap from 'gsap'; // Enabled for animation
// import { SplitText } from 'gsap/SplitText'; // Not needed for this animation

// gsap.registerPlugin(SplitText); // Not needed for this animation

interface HeroProps {
  title: string;
  description?: string;
}

export default function Hero({ title }: HeroProps) {
  const container = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null); // Ref for the marquee container

  useGSAP(() => {
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      xPercent: -50, // Move 50% of its own width to the left (because we duplicated it)
      repeat: -1, // Infinite repeat
      duration: 40, // Adjust speed as needed (e.g., 20 or 30)
      ease: 'none', // Critical for seamless loop
    });
  }, { scope: container });

  return (
    <section ref={container} className="h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative z-10 w-full overflow-hidden whitespace-nowrap">
        <div ref={marqueeRef} className="flex">
          <h1 className="font-syne text-white uppercase font-black text-[clamp(4rem,12vw,10rem)] tracking-[-0.02em] inline-block pr-8">
            {title}
          </h1>
          <h1 className="font-syne text-white uppercase font-black text-[clamp(4rem,12vw,10rem)] tracking-[-0.02em] inline-block pr-8">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

