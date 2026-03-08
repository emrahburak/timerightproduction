'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getShowcaseStackUrl, getRitmImageUrl } from '@/lib/constants';
import { ritmImages } from '@/data/ritm';

const bgImageUrl = getShowcaseStackUrl('ritm', '');
const MAX_VISIBLE_CARDS = 4;

export default function RhythmAtelier() {
  const [cards, setCards] = useState(ritmImages);

  const moveToEnd = useCallback(() => {
    setCards(prev => [...prev.slice(1), prev[0]]);
  }, []);

  const moveToStart = useCallback(() => {
    setCards(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
  }, []);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // Yukarı sürükle → aktif kartı arkaya gönder
    if (offset > 50 || velocity > 500) {
      moveToEnd();
    }
    // Aşağı sürükle → son kartı öne al
    else if (offset < -50 || velocity < -500) {
      moveToStart();
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

      {/* Card Stack Container */}
      <div className="relative z-[10] w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {cards.slice(0, MAX_VISIBLE_CARDS).map((image, index) => {
            const brightness = Math.max(0.3, 1 - index * 0.15);
            const scale = 1 - index * 0.06;
            const offsetY = index * 10;

            return (
              <motion.div
                key={image}
                className="absolute w-72 aspect-[3/4]"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{
                  opacity: 1,
                  scale,
                  y: offsetY,
                  filter: `brightness(${brightness})`,
                }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{
                  type: 'spring',
                  stiffness: 170,
                  damping: 26,
                }}
                drag={index === 0 ? 'y' : false}
                dragElastic={0.7}
                onDragEnd={index === 0 ? handleDragEnd : undefined}
                whileDrag={{ scale: 1.05 }}
                style={{
                  zIndex: MAX_VISIBLE_CARDS - index,
                }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  <Image
                    src={getRitmImageUrl(image)}
                    alt={`Ritm ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Left Arrow Button — moveToStart */}
      <button
        onClick={moveToStart}
        className="absolute z-[20] left-4 md:left-8 top-1/2 -translate-y-1/2
                   w-12 h-12 rounded-full backdrop-blur-md
                   bg-white/10 hover:bg-white/20
                   border border-white/20
                   flex items-center justify-center
                   transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Previous card"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Right Arrow Button — moveToEnd */}
      <button
        onClick={moveToEnd}
        className="absolute z-[20] right-4 md:right-8 top-1/2 -translate-y-1/2
                   w-12 h-12 rounded-full backdrop-blur-md
                   bg-white/10 hover:bg-white/20
                   border border-white/20
                   flex items-center justify-center
                   transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Next card"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </section>
  );
}
