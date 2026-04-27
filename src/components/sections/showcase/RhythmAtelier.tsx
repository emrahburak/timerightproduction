'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Removed useGSAP, gsap, ScrollTrigger imports as quote animation is removed
import { getShowcaseStackUrl, getRitmImageUrl } from '@/lib/constants';
import { ritmImages } from '@/data/ritm';

// Removed gsap.registerPlugin(ScrollTrigger);

const bgImageUrl = getShowcaseStackUrl('ritm', '');

const randomRotate = () => Math.floor(Math.random() * 21) - 10;

interface RhythmAtelierProps {
  messages: {
    title: string;
    description: string; // 'quote' removed from here
  };
}

export default function RhythmAtelier({ messages }: RhythmAtelierProps) {
  const [active, setActive] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  // Removed quoteRef as quote animation is removed
  const dragStartX = useRef<number | null>(null);

  // Removed quoteChars useMemo as quote animation is removed
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Removed useGSAP hook for quote animation

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + ritmImages.length) % ritmImages.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % ritmImages.length);
  };

  const handleSwipe = (startX: number, endX: number) => {
    const diff = startX - endX;
    if (Math.abs(diff) < 50) return; 

    if (diff > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    handleSwipe(dragStartX.current, e.clientX);
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

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      <Image
        src={bgImageUrl}
        alt="Ritm Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-[2]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30 z-[1]" />

      <div
        className="relative z-[10] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 w-full max-w-5xl mx-auto px-6 md:px-12 items-center mt-8 md:mt-0"
      >
        {/* Left Column - Photo Stack */}
        <div
          className="h-80 w-full relative order-2 md:order-1"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence>
            {hasMounted && ritmImages.map((image, index) =>
              index === active ? (
                <motion.div
                  key={image}
                  className="absolute top-0 left-0 w-full h-full"
                  initial={{ opacity: 0, scale: 0.9, rotate: randomRotate(), y: -20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    zIndex: 999,
                    y: [0, -40, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.9, rotate: randomRotate(), y: 20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ originX: 'center', originY: 'center' }}
                >
                  <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                    <Image
                      src={getRitmImageUrl(image)}
                      alt={`Rhythm Atelier Image ${index + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 80vw, 40vw"
                    />
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Title, Description & Navigation */}
        <div className="flex flex-col justify-center py-4 order-1 md:order-2">
           <h2 className="font-syne font-black uppercase text-[clamp(1.5rem,3vw,3rem)] text-white tracking-widest leading-tight mb-4">
            {messages.title}
          </h2>
          <p className="font-cormorant text-2xl md:text-3xl text-white/80 leading-relaxed mb-8">
            {messages.description}
          </p>
          
          <div className="flex gap-4 pt-8">
            <button
              onClick={handlePrev}
              className="flex-shrink-0 w-12 h-12 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="flex-shrink-0 w-12 h-12 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
