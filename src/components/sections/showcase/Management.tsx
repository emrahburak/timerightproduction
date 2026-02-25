'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ManagementProps {
  title: string;
  subtitle: string;
  text: string[];
}

const Management: React.FC<ManagementProps> = ({ title, subtitle, text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textContainerRef.current) return;

    const words = gsap.utils.toArray<HTMLSpanElement>('.management-word');

    // Initial state: words rotated 90deg (perpendicular to screen)
    gsap.set(words, {
      rotationX: 90,
      opacity: 0,
      transformOrigin: '50% 100%',
    });

    // Animate words entering (90deg → 0deg)
    gsap.to(words, {
      rotationX: 0,
      opacity: 1,
      stagger: 0.015,
      duration: 0.8,
      ease: 'expo.out',
      delay: 0.2,
    });

    // Optional: Re-animate on scroll (for demo purposes)
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => {
        // Exit animation (0deg → -90deg)
        gsap.to(words, {
          rotationX: -90,
          opacity: 0,
          stagger: 0.015,
          duration: 0.6,
          ease: 'power2.in',
          transformOrigin: '50% 100%',
          delay: 1.5, // Wait before exiting
        });

        // Re-enter animation (-90deg → 0deg)
        gsap.fromTo(
          words,
          {
            rotationX: 90,
            opacity: 0,
            transformOrigin: '50% 100%',
          },
          {
            rotationX: 0,
            opacity: 1,
            stagger: 0.015,
            duration: 0.8,
            ease: 'expo.out',
            delay: 2.1,
          }
        );
      },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="management-section w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/5 via-black to-black opacity-50" />

      <div className="container mx-auto px-10 flex flex-col items-center text-center relative z-10">
        {/* Subtitle */}
        <h3 className="font-syne font-bold text-xl md:text-2xl lg:text-3xl text-white mb-6 tracking-wide uppercase">
          {subtitle}
        </h3>

        {/* Title */}
        <h2 className="font-syne font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-none uppercase mb-8">
          {title}
        </h2>

        {/* 3D Text Container - Cylinder/Flap Effect */}
        <div
          ref={textContainerRef}
          className="perspective-[800px]"
        >
          <div className="flex flex-col justify-center gap-2 md:gap-3">
            {text.map((word, index) => (
              <span
                key={index}
                className="management-word inline-block font-syne font-bold text-lg md:text-xl lg:text-2xl text-white backface-hidden will-change-transform"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Background large text for texture */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-black text-[30vw] whitespace-nowrap leading-none">
          {title}
        </span>
      </div>
    </section>
  );
};

export default Management;
