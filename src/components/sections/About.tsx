// src/components/sections/About.tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  title: string;
  content: string;
}

export default function About({ title, content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null); // Ref for the image placeholder

  useGSAP(() => {
    // Animation for title
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%', // Start animation when top of title is 80% from top of viewport
          end: 'bottom 20%',
          scrub: true,
        },
      }
    );

    // Animation for content (paragraph)
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2, // Slight delay for parallax effect
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      }
    );

    // Animation for image placeholder (parallax)
    gsap.fromTo(imageRef.current,
      { y: -50 }, // Start slightly above
      {
        y: 50, // End slightly below
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current, // Trigger from the whole section
          start: 'top bottom', // When bottom of section enters view
          end: 'bottom top',   // When top of section leaves view
          scrub: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="min-h-[150vh] bg-black relative flex items-center justify-center overflow-hidden p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 ref={titleRef} className="font-syne text-6xl uppercase font-bold text-white mb-4">
            {title}
          </h1>
          <p ref={contentRef} className="font-cormorant text-2xl italic text-white/80 mt-10">
            {content}
          </p>
        </div>
        <div ref={imageRef} className="aspect-[3/4] bg-white/5 w-full rounded-lg">
          {/* Placeholder for image */}
        </div>
      </div>
    </section>
  );
}

