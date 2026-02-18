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
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current) return;

    // Text reveal animation
    gsap.from(textRef.current.children, {
      y: 20,
      opacity: 0,
      filter: 'blur(10px)',
      skewY: 7,
      stagger: 0.05,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        once: true,
      },
    });


  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      data-section="statement"
      className="relative flex items-center justify-center h-screen bg-black w-full overflow-hidden"
    >
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
