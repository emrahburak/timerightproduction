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
  const animationFrameRef = useRef<number | null>(null);

  const isActive = current === index;

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!isActive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    xRef.current = e.clientX - centerX;
    yRef.current = e.clientY - centerY;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', `${xRef.current}px`);
        cardRef.current.style.setProperty('--y', `${yRef.current}px`);
      }
    });
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;

    if (cardRef.current) {
      cardRef.current.style.setProperty('--x', '0px');
      cardRef.current.style.setProperty('--y', '0px');
    }
  };

  const isActiveStyle = isActive
    ? { scale: '1', rotateX: '0deg', opacity: '1' }
    : { scale: '0.98', rotateX: '8deg', opacity: '0.5' };

  const innerTransform = isActive
    ? 'translate3d(calc(var(--x)/30), calc(var(--y)/30), 0)'
    : 'none';

  return (
    <li
      ref={cardRef}
      className="absolute w-[70vmin] h-[70vmin] cursor-pointer"
      style={{
        transform: `scale(${isActiveStyle.scale}) rotateX(${isActiveStyle.rotateX}deg)`,
        transformOrigin: 'bottom',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: parseFloat(isActiveStyle.opacity),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(index)}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-sm"
        style={{
          transform: innerTransform,
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
        className="relative z-[10] w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <ul
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(-${current * (100 / slides.length)}%)`,
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
      <div className="absolute z-[20] bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
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
