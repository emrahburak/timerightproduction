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
  const isActive = current === index;

  return (
    <div style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
      <li
        className="flex-shrink-0 w-[70vmin] h-[70vmin] cursor-pointer"
        style={{
          transform: isActive
            ? 'scale(1) rotateX(0deg)'
            : 'scale(0.98) rotateX(8deg)',
          transformOrigin: 'bottom',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isActive ? 1 : 0.5,
        }}
        onClick={() => onClick(index)}
      >
        <div
          className="relative w-full h-full overflow-hidden rounded-sm"
          style={{
            transform: 'none',
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

interface RhythmAtelierProps {
  messages: {
    title: string;
  };
}

export default function RhythmAtelier({ messages }: RhythmAtelierProps) {
  const slides = ritmImages;
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ];

  const [current, setCurrent] = useState(1);
  const [grabbing, setGrabbing] = useState(false);
  const isTransitioning = useRef(false);
  const ulRef = useRef<HTMLUListElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handlePrev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrent(prev => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrent(prev => prev + 1);
  };

  const handleSlideClick = (index: number) => {
    if (index !== current && !isTransitioning.current) {
      isTransitioning.current = true;
      setCurrent(index);
    }
  };

  const handleSwipe = (startX: number, endX: number) => {
    if (isTransitioning.current) return;

    const diff = startX - endX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    setGrabbing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    isDragging.current = false;
    setGrabbing(false);
    handleSwipe(dragStartX.current, e.clientX);
    dragStartX.current = null;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setGrabbing(false);
    dragStartX.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    handleSwipe(dragStartX.current, e.changedTouches[0].clientX);
    dragStartX.current = null;
  };

  useEffect(() => {
    if (!ulRef.current) return;

    if (current === extendedSlides.length - 1) {
      setTimeout(() => {
        ulRef.current!.style.transition = 'none';
        setCurrent(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (ulRef.current) {
              ulRef.current.style.transition = 'transform 1000ms ease-in-out';
            }
            isTransitioning.current = false;
          });
        });
      }, 1000);
    }
    else if (current === 0) {
      setTimeout(() => {
        ulRef.current!.style.transition = 'none';
        setCurrent(slides.length);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (ulRef.current) {
              ulRef.current.style.transition = 'transform 1000ms ease-in-out';
            }
            isTransitioning.current = false;
          });
        });
      }, 1000);
    }
    else {
      setTimeout(() => {
        isTransitioning.current = false;
      }, 1000);
    }
  }, [current, extendedSlides.length, slides.length]);

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

      {/* Title */}
      <h2
        className="absolute top-8 left-1/2 -translate-x-1/2
                   z-[10] text-center w-[90vw] max-w-2xl
                   font-syne font-black uppercase
                   text-[clamp(1.2rem,4vw,4rem)]
                   text-white tracking-widest
                   leading-tight"
      >
        {messages.title}
      </h2>

      {/* Carousel Container */}
      <div
        className={`relative z-[10] overflow-hidden ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ width: '70vmin', height: '70vmin', margin: '0 auto', marginTop: '8rem' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ul
          ref={ulRef}
          className="m-0 p-0 list-none"
          style={{
            display: 'flex',
            width: `${extendedSlides.length * 70}vmin`,
            transform: `translateX(calc(-${current} * 70vmin))`,
            transition: 'transform 1000ms ease-in-out',
          }}
        >
          {extendedSlides.map((image, index) => (
            <Slide
              key={`${image}-${index}`}
              image={image}
              index={index}
              current={current}
              onClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute z-[20] bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
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
