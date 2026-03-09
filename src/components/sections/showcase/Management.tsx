'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getShowcaseStackUrl } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface ManagementProps {
  title: string;
  subtitle: string;
  text: string[];
}

const Management: React.FC<ManagementProps> = ({ title, subtitle, text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const imageUrl = getShowcaseStackUrl('management', 'timeright-image-showcase-03.webp');

  useGSAP(() => {
    if (!textContainerRef.current) return;

    // Subtitle — en erken başlar
    const subtitleWords = gsap.utils.toArray<HTMLSpanElement>(
      '.subtitle-word'
    );
    gsap.set(subtitleWords, {
      rotationX: 90,
      opacity: 0,
      transformOrigin: '50% 100%',
    });
    gsap.to(subtitleWords, {
      rotationX: 0,
      opacity: 1,
      stagger: 0.04,
      duration: 0.7,
      ease: 'expo.out',
      delay: 0.1,
    });

    // Title — subtitle'dan biraz sonra
    const titleWords = gsap.utils.toArray<HTMLSpanElement>(
      '.title-word'
    );
    gsap.set(titleWords, {
      rotationX: 90,
      opacity: 0,
      transformOrigin: '50% 100%',
    });
    gsap.to(titleWords, {
      rotationX: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.8,
      ease: 'expo.out',
      delay: 0.3,
    });

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
      delay: 0.6,
    });

    // Re-animate on scroll logic
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      onEnter: () => {
        gsap.to(words, {
          rotationX: -90,
          opacity: 0,
          stagger: 0.015,
          duration: 0.6,
          ease: 'power2.in',
          transformOrigin: '50% 100%',
          delay: 1.9,
        });

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
            delay: 2.5,
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
      {/* Background Image Layer */}
      <Image
        src={imageUrl}
        alt="Management Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />

      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black opacity-50 z-[1]" />

      <div className="container mx-auto px-10 flex flex-col items-center text-center relative z-10">
        {/* Subtitle */}
        <h3
          ref={subtitleRef}
          className="font-syne font-bold text-xl md:text-2xl lg:text-3xl text-white/70 mb-6 tracking-wide uppercase"
        >
          {subtitle.split(' ').map((word, i) => (
            <span
              key={i}
              className="subtitle-word inline-block mr-[0.25em]"
            >
              {word}
            </span>
          ))}
        </h3>

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-syne font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-none uppercase mb-8"
        >
          {title.split(' ').map((word, i) => (
            <span
              key={i}
              className="title-word inline-block mr-[0.25em]"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* 3D Text Container */}
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
