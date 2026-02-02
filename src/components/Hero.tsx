'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin

interface HeroProps {
  title: string;
  description: string;
}

export default function Hero({ title, description }: HeroProps) {
  const container = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useGSAP(() => {
    // Initial entrance animations
    gsap.from(titleRef.current, {
      y: -50, // Start 50 pixels above
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(descriptionRef.current, {
      opacity: 0,
      duration: 1.5,
      delay: 0.5, // Start fading in after the title animation begins
      ease: 'power2.out',
    });

    // ScrollTrigger animation for the title
    gsap.to(titleRef.current, {
      x: 200, // Move title 200 pixels to the right
      opacity: 0, // Make it fade out
      scrollTrigger: {
        trigger: container.current, // When this section enters the viewport
        start: 'top top', // Animation starts when the top of the trigger hits the top of the viewport
        end: 'bottom top', // Animation ends when the bottom of the trigger hits the top of the viewport
        scrub: true, // Link animation to scroll position
        // markers: true, // For debugging purposes
      },
    });

  }, { scope: container }); // Apply GSAP animations within the scope of this component

  return (
    <section ref={container} className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 ref={titleRef} className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p ref={descriptionRef} className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
        {description}
      </p>
    </section>
  );
}

