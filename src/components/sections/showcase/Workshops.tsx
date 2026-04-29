'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Thumbnails, Fullscreen, Zoom } from 'yet-another-react-lightbox/plugins';
import { getShowcaseStackUrl, getWorkshopImageUrl } from '@/lib/constants';
import { workshops, type WorkshopItem } from '@/data/workshops';

function MasonryItem({
  item,
  index,
  globalIndex,
  onImageClick,
}: {
  item: WorkshopItem;
  index: number;
  globalIndex: number;
  onImageClick: (item: WorkshopItem, index: number) => void;
}) {
  return (
    <div
      className="break-inside-avoid mb-2
                 relative rounded-lg overflow-hidden
                 cursor-pointer group"
      style={{
        height: index % 2 === 0 ? '180px' : '140px',
      }}
      onClick={() => onImageClick(item, globalIndex)}
    >
      <Image
        src={getWorkshopImageUrl(item.image)}
        alt={item.title}
        fill
        className="object-cover transition-transform
                   duration-500 group-hover:scale-105"
        sizes="45vw"
      />
      <div className="absolute inset-0
                      bg-gradient-to-t from-black/80
                      via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0
                      p-3 translate-y-full
                      group-hover:translate-y-0
                      transition-transform duration-300">
        <h3 className="text-white text-sm font-syne
                       font-bold leading-tight">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

function MasonryGrid({
  onImageClick,
}: {
  onImageClick: (item: WorkshopItem, index: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = workshops.slice(0, 6);
  const hiddenItems = workshops.slice(6);

  return (
    <div className="w-full px-4 flex flex-col gap-0">

      {/* Her zaman görünen ilk 6 görsel */}
      <div
        style={{ columnCount: 2, columnGap: '0.5rem' }}
      >
        {visibleItems.map((item, index) => (
          <MasonryItem
            key={item.image}
            item={item}
            index={index}
            globalIndex={index}
            onImageClick={onImageClick}
          />
        ))}
      </div>

      {/* Accordion — sadece hiddenItems varsa render et */}
      {hiddenItems.length > 0 && (
        <>
          {/* Expand/Collapse alanı */}
          <div
            style={{
              maxHeight: isExpanded ? '2000px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease-in-out',
            }}
          >
            <div
              style={{
                columnCount: 2,
                columnGap: '0.5rem',
                paddingTop: '0.5rem',
              }}
            >
              {hiddenItems.map((item, index) => (
                <MasonryItem
                  key={item.image}
                  item={item}
                  index={index}
                  globalIndex={6 + index}
                  onImageClick={onImageClick}
                />
              ))}
            </div>
          </div>

          {/* Accordion Butonu */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center
                       justify-center gap-2 py-3 px-4
                       rounded-lg border border-white/20
                       bg-white/5 backdrop-blur-sm
                       text-white/80 font-syne font-bold
                       text-sm uppercase tracking-wider
                       transition-all duration-300
                       active:bg-white/10"
          >
            <span>
              {isExpanded ? 'Gizle' : 'Tüm Fotoğrafları Göster'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isExpanded
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </>
      )}

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

  useGSAP(() => {
    if (!scrollRef.current) return;

    const scrollEl = scrollRef.current;

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Split title by comma for two-line display
  const titleParts = useMemo(() => messages.title.split(','), [messages.title]);
  const titleLine1 = useMemo(() => titleParts[0] + ',', [titleParts]);
  const titleLine2 = useMemo(() => titleParts[1] || '', [titleParts]);

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

  useGSAP(() => {
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.015,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, { scope: sectionRef });

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

      <section className="w-full min-h-screen relative flex flex-col lg:flex-row overflow-hidden bg-black py-24 lg:py-32">

      {/* Arka plan görseli - Tüm bileşen */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getShowcaseStackUrl('workshop', '')}
          alt="Workshop Background"
          fill
          className="object-cover opacity-40"
        />
        {/* Top Fade-out Overlay */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
        {/* Bottom Fade-out Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-[2]" />
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
      <div ref={sectionRef} className="relative z-20 w-full lg:w-[40%] h-auto lg:h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:py-0">
        {/* İçerik */}
        <div className="relative z-10">
          <h2
            ref={titleRef}
            className="font-syne uppercase font-black text-[clamp(1.25rem,5vw,2.8rem)] text-white leading-tight mb-6 text-center lg:text-left"
          >
            {/* Line 1 */}
            <span className="block whitespace-nowrap">
              {titleLine1.split('').map((char, index) => (
                <span
                  key={`line1-${index}-${char}`}
                  className="char inline-block"
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
            {/* Line 2 */}
            <span className="block whitespace-nowrap">
              {titleLine2.split('').map((char, index) => (
                <span
                  key={`line2-${index}-${char}`}
                  className="char inline-block"
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h2>
          <p
            className="font-cormorant text-xl md:text-2xl text-white/80 leading-relaxed max-w-xl text-justify"
          >
            {messages.paragraph1}
          </p>
          <p 
            className="hidden md:block font-cormorant text-xl md:text-2xl text-white/80 leading-relaxed max-w-xl mt-4 text-justify"
          >
            {messages.paragraph2}
          </p>
        </div>
      </div>

      {/* KATMAN B — Dikey geçiş maskesi (Sol panel sağ kenarında) */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 z-15 pointer-events-none"
        style={{
          left: '38%',
          width: '250px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)',
        }}
      />

      {/* MASONRY GRID - Mobile/Tablet only (< lg) */}
      <div className="lg:hidden relative z-10 w-full py-6">
        <MasonryGrid onImageClick={handleImageClick} />
      </div>

      {/* SAĞ PANEL - Görsel Şeritleri - Desktop only (lg+) */}
      <div className="hidden lg:flex absolute left-[40%] top-0 w-[80%] h-full z-10 flex-col justify-center gap-8">
        {/* KATMAN C — Row sol kenar vignette */}
        <div
          className="absolute top-0 left-0 bottom-0 z-11 pointer-events-none"
          style={{
            width: '180px',
            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }}
        />
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
