'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  content: string;
}

export default function Statement({ content }: SectionProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    // Split the text into words and animate each word
    // We need to target the children (spans) of the paragraph
    gsap.from(textRef.current.children, {
      y: 20,
      opacity: 0,
      filter: 'blur(10px)',
      skewY: 7, // Skew on the Y-axis
      stagger: 0.05, // Stagger animation for each word
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%', // When top of trigger hits 80% of viewport
        once: true, // Only animate once
      },
    });
  }, { scope: textRef }); // Scope to the text container

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-black w-full overflow-hidden">
      <p ref={textRef} className="font-cormorant italic text-white/90 max-w-4xl px-6 text-center leading-relaxed text-[clamp(1.5rem,4vw,3rem)]">
        {content.split(' ').map((word, index) => (
          <span key={index} className="inline-block">
            {word}&nbsp;
          </span>
        ))}
      </p>
    </section>
  );
}
