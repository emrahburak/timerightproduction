'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getShowcaseStackUrl, getRitmImageUrl } from '@/lib/constants';
import { ritmImages } from '@/data/ritm';

const bgImageUrl = getShowcaseStackUrl('ritm', '');

interface SlideProps {
  image: string;
  index: number;
  current: number;
  onClick: (index: number) => void;
}

function Slide({ image, index, current, onClick }: SlideProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const isActive = current === index;

  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty('--x', `${xRef.current}px`);
      cardRef.current.style.setProperty('--y', `${yRef.current}px`);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!isActive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    xRef.current = e.clientX - centerX;
    yRef.current = e.clientY - centerY;
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  return (
    <div style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
      <li
        ref={cardRef}
        className="flex-shrink-0 w-[70vmin] h-[70vmin] cursor-pointer"
        style={{
          transform: isActive
            ? 'scale(1) rotateX(0deg)'
            : 'scale(0.98) rotateX(8deg)',
          transformOrigin: 'bottom',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isActive ? 1 : 0.5,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(index)}
      >
        <div
          className="relative w-full h-full overflow-hidden rounded-sm"
          style={{
            transform: isActive
              ? 'translate3d(calc(var(--x)/30), calc(var(--y)/30), 0)'
              : 'none',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <Image
            src={getRitmImageUrl(image)}
            alt={`Ritm ${index + 1}`}
            fill
            className="object-cover"
            sizes="70vmin"
          />
        </div>
      </li>
    </div>
  );
}

export default function RhythmAtelier() {
  const [current, setCurrent] = useState(0);
  const slides = ritmImages;

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const handleSlideClick = (index: number) => {
    if (index !== current) {
      setCurrent(index);
    }
  };

  return (
    <section className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Image Layer */}
      <Image
        src={bgImageUrl}
        alt="Ritm Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />

      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />

      {/* Ambience Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30 z-[1]" />

      {/* Carousel Container */}
      <div
        className="relative z-[10] overflow-hidden"
        style={{ width: '70vmin', height: '70vmin', margin: '0 auto' }}
      >
        <ul
          className="m-0 p-0 list-none"
          style={{
            display: 'flex',
            width: `${slides.length * 70}vmin`,
            transform: `translateX(calc(-${current} * 70vmin))`,
            transition: 'transform 1000ms ease-in-out',
          }}
        >
          {slides.map((image, index) => (
            <Slide
              key={image}
              image={image}
              index={index}
              current={current}
              onClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute z-[20] bottom-8 left-1/2 -translate-x-1/2 flex gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full backdrop-blur-sm
                     bg-white/10 hover:bg-white/20
                     border border-white/20
                     flex items-center justify-center
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full backdrop-blur-sm
                     bg-white/10 hover:bg-white/20
                     border border-white/20
                     flex items-center justify-center
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </section>
  );
}
