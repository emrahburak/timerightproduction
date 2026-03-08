'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import { getShowcaseStackUrl, getWorkshopImageUrl } from '@/lib/constants';
import { workshops, type WorkshopItem } from '@/data/workshops';

// Carousel Card Component for Mobile/Tablet
function CarouselCard({
  item,
  index,
  isActive,
  onImageClick,
}: {
  item: WorkshopItem;
  index: number;
  isActive: boolean;
  onImageClick: (item: WorkshopItem, index: number) => void;
}) {
  return (
    <div
      className="snap-center flex-shrink-0 w-[75vw] h-[260px] relative rounded-lg overflow-hidden transition-all duration-300 ease-out"
      style={{
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
        opacity: isActive ? 1 : 0.6,
      }}
      onClick={() => onImageClick(item, index)}
    >
      <Image
        src={getWorkshopImageUrl(item.image)}
        alt={item.title}
        fill
        className="object-cover"
        sizes="75vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}

// Dot Indicator Component
function DotIndicator({
  total,
  activeIndex,
  onClick,
}: {
  total: number;
  activeIndex: number;
  onClick: (index: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? 'bg-white w-6'
              : 'bg-white/40 hover:bg-white/60'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

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

interface WorkshopsProps {
  messages: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
}

export default function Workshops({ messages }: WorkshopsProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.75; // 75vw
      const gap = 16; // gap-4
      const scrollPosition = index * (cardWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth * 0.75;
      const gap = 16;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < workshops.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll, { passive: true });
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

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

      <section className="w-full min-h-screen lg:h-screen relative flex flex-col lg:flex-row overflow-hidden bg-black">

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
      <div className="relative z-20 w-full lg:w-[40%] h-auto lg:h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-0">
        {/* İçerik */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 lg:mb-6">
            {messages.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-md">
            {messages.paragraph1}
          </p>
          <p className="hidden md:block text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-md mt-4">
            {messages.paragraph2}
          </p>
        </div>
      </div>

      {/* CAROUSEL - Mobile/Tablet only (< lg) */}
      <div className="lg:hidden relative z-10 w-full flex flex-col items-center py-8">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth w-full px-6"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {workshops.map((item, index) => (
            <CarouselCard
              key={item.image}
              item={item}
              index={index}
              isActive={index === activeIndex}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
        <DotIndicator
          total={workshops.length}
          activeIndex={activeIndex}
          onClick={handleDotClick}
        />
      </div>

      {/* SAĞ PANEL - Görsel Şeritleri - Desktop only (lg+) */}
      <div className="hidden lg:block absolute left-[40%] top-0 w-[80%] h-full z-10 flex flex-col justify-center gap-8">
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
