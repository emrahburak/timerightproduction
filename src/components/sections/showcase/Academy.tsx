'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AcademyCard from './AcademyCard';
import { academyPrograms } from '@/data/academy';
import { getShowcaseStackUrl } from '@/lib/constants';

interface AcademyProps {
  programs: {
    acting: { title: string; courses: string[] };
    writing: { title: string; courses: string[] };
    rhythm: { title: string; courses: string[] };
  };
}

const Academy: React.FC<AcademyProps> = ({ programs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrl = getShowcaseStackUrl('academy', 'timeright-image-showcase-01.webp');

  useGSAP(() => {
    if (!containerRef.current) return;

    // Stagger animation for cards
    gsap.fromTo('.academy-card-wrapper',
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
      }
    );
  }, { scope: containerRef });

  // Map programs data to card props
  const cards = [
    {
      title: programs.acting.title,
      courses: programs.acting.courses,
      icon: academyPrograms[0].icon,
      themeColor: 'blue' as const,
    },
    {
      title: programs.writing.title,
      courses: programs.writing.courses,
      icon: academyPrograms[1].icon,
      themeColor: 'amber' as const,
    },
    {
      title: programs.rhythm.title,
      courses: programs.rhythm.courses,
      icon: academyPrograms[2].icon,
      themeColor: 'purple' as const,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <section
      ref={containerRef}
      className="academy-section w-full min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative py-24 lg:py-32"
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt="Academy Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />

      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
      
      {/* Bottom Fade-out Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-[2]" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-50 z-[1]" />

      {/* Cards Grid - Responsive layout */}
      <div className="container mx-auto px-4 relative z-10 max-w-[1400px]">
        
        {/* MOBILE/TABLET — Swipe Carousel (< lg) */}
        <div className="lg:hidden relative w-full flex flex-col items-center overflow-hidden">
          {/* Perspective wrapper */}
          <div
            className="relative w-full h-[640px] flex items-center justify-center"
            style={{ perspective: '1000px' }}
          >
            {cards.map((card, index) => {
              const total = cards.length;
              let offset = index - activeIndex;
              if (offset > Math.floor(total / 2)) offset -= total;
              if (offset < -Math.floor(total / 2)) offset += total;

              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const isHidden = Math.abs(offset) > 1;

              return (
                <div
                  key={index}
                  className="absolute transition-all duration-500 ease-in-out"
                  style={{
                    transform: `
                      translateX(${offset * 65}%)
                      scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                      rotateY(${offset * -15}deg)
                    `,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                    filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                    visibility: isHidden ? 'hidden' : 'visible',
                    pointerEvents: isCenter ? 'auto' : 'none',
                    width: '85vw',
                    maxWidth: '360px',
                  }}
                >
                  <AcademyCard
                    title={card.title}
                    icon={card.icon}
                    courses={card.courses}
                    themeColor={card.themeColor}
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation & Pagination */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="flex gap-2">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* DESKTOP — 3 Column Layout (lg+) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 lg:gap-10 items-stretch justify-items-center">
          {cards.map((card, index) => (
            <div key={index} className="academy-card-wrapper w-full flex justify-center h-full">
              <AcademyCard
                title={card.title}
                icon={card.icon}
                courses={card.courses}
                themeColor={card.themeColor}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Background large text for texture */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-black text-[20vw] whitespace-nowrap leading-none">
          ACADEMY
        </span>
      </div>
    </section>
  );
};

export default Academy;
