'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import { getShowcaseStackUrl, getWorkshopImageUrl } from '@/lib/constants';
import { workshops, type WorkshopItem } from '@/data/workshops';

function ScrollRow({
  items,
  direction,
  speed,
  onImageClick,
  rowOffset,
}: {
  items: WorkshopItem[];
  direction: 'rtl' | 'ltr';
  speed: number;
  onImageClick: (item: WorkshopItem, globalIndex: number) => void;
  rowOffset: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationStateRef = useRef<{ pause: () => void; resume: () => void } | null>(null);

  const duplicatedItems = [...items, ...items];
  const ITEM_WIDTH = 280;
  const GAP = 16;
  const ITEM_TOTAL = ITEM_WIDTH + GAP;

  useGSAP(() => {
    if (!scrollRef.current) return;

    const scrollEl = scrollRef.current;
    const halfWidth = scrollEl.scrollWidth / 2;

    // Set initial position based on direction
    if (direction === 'rtl') {
      // RTL: Start at 0, move left to -50%
      gsap.set(scrollEl, { xPercent: 0 });
    } else {
      // LTR: Start at -50%, move right to 0
      gsap.set(scrollEl, { xPercent: -50 });
    }

    // Create animation
    const tween = direction === 'rtl'
      ? gsap.to(scrollEl, {
          xPercent: -50,
          ease: 'none',
          duration: speed,
          repeat: -1,
        })
      : gsap.to(scrollEl, {
          xPercent: 0,
          ease: 'none',
          duration: speed,
          repeat: -1,
        });

    // Store pause/resume functions
    animationStateRef.current = {
      pause: () => tween.pause(),
      resume: () => tween.resume(),
    };

    // Cleanup on unmount
    return () => {
      tween.kill();
      animationStateRef.current = null;
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240px] overflow-hidden whitespace-nowrap"
      onMouseEnter={() => animationStateRef.current?.pause()}
      onMouseLeave={() => animationStateRef.current?.resume()}
    >
      <div
        ref={scrollRef}
        className="inline-flex w-max h-full items-center"
      >
        {duplicatedItems.map((item, index) => {
          const globalIndex = rowOffset + (index % items.length);
          const isValidIndex = globalIndex < workshops.length;

          return (
            <div
              key={`${item.image}-${index}`}
              className="relative flex-shrink-0 rounded-lg overflow-hidden group"
              style={{
                width: ITEM_WIDTH,
                height: 220,
                marginRight: GAP,
              }}
              onClick={() => {
                if (isValidIndex) {
                  onImageClick(item, globalIndex);
                }
              }}
            >
              <div className={isValidIndex ? 'cursor-pointer' : 'cursor-default'}>
                <Image
                  src={getWorkshopImageUrl(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-all duration-500"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                  <h3 className="text-white text-base font-bold">{item.title}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Workshops() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const rowData = [
    workshops.slice(0, 8),
    workshops.slice(8, 16),
    workshops.slice(16, 24),
  ];

  const rowConfigs = [
    { direction: 'ltr' as const, speed: 60 },
    { direction: 'rtl' as const, speed: 60 },
    { direction: 'ltr' as const, speed: 60 },
  ];

  const handleImageClick = (item: WorkshopItem, index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <>
      {/* LIGHTBOX - Image modal */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={currentIndex}
        slides={workshops.map(item => ({
          src: getWorkshopImageUrl(item.image),
          alt: item.title,
          title: item.title,
          description: item.description,
        }))}
        
        plugins={[Thumbnails, Fullscreen, Zoom]}
        
        // Overlay customization
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
          },
        }}
        
        // Zoom ayarları
        zoom={{
          maxZoomPixelRatio: 3,
        }}
      />

      <section className="w-full min-h-[120vh] lg:h-screen relative flex flex-col lg:flex-row overflow-hidden bg-black">

      {/* Arka plan görseli - Tüm bileşen */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getShowcaseStackUrl('workshop', '')}
          alt="Workshop Background"
          fill
          className="object-cover opacity-40"
        />
      </div>

      {/* GLOBAL OVERLAY - Tüm section'ı kaplar (sinematik bütünlük) */}
      {/* Sol taraftan ortaya doğru yumuşak geçiş - content ile rows arası belirsizlik */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 35% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)'
        }}
      />

      {/* SOL PANEL - İçerik */}
      <div className="relative z-20 w-full lg:w-[40%] h-full flex flex-col justify-center px-12 md:px-16">
        {/* İçerik */}
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Workshops
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-md mt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
        </div>
      </div>

      {/* SAĞ PANEL - Görsel Şeritleri */}
      <div className="absolute left-[40%] top-0 w-[80%] h-full z-10 flex flex-col justify-center gap-6 lg:gap-8 px-4">
        {rowConfigs.map((config, rowIndex) => (
          <ScrollRow
            key={`row-${rowIndex}`}
            items={rowData[rowIndex] || []}
            direction={config.direction}
            speed={config.speed}
            onImageClick={handleImageClick}
            rowOffset={rowIndex * 8}
          />
        ))}
      </div>
    </section>
    </>
  );
}
