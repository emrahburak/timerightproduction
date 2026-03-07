'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { getShowcaseStackUrl, getWorkshopImageUrl } from '@/lib/constants';
import { workshops, type WorkshopItem } from '@/data/workshops';

function ScrollRow({
  items,
  direction,
  speed,
}: {
  items: WorkshopItem[];
  direction: 'rtl' | 'ltr';
  speed: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const duplicatedItems = [...items, ...items];

  useGSAP(() => {
    if (!scrollRef.current) return;

    if (direction === 'rtl') {
      // Row 1 & 3: Right to Left
      tweenRef.current = gsap.to(scrollRef.current, {
        xPercent: -50,
        x: 0,
        ease: 'none',
        duration: speed,
        repeat: -1,
      });
    } else {
      // Row 2: Left to Right
      tweenRef.current = gsap.fromTo(scrollRef.current,
        { xPercent: -50, x: '-50%' },
        {
          xPercent: 0,
          x: 0,
          ease: 'none',
          duration: speed,
          repeat: -1,
        }
      );
    }
  }, { scope: containerRef });
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-[240px] overflow-hidden whitespace-nowrap"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div
        ref={scrollRef}
        className="inline-flex gap-4 w-max h-full items-center"
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className="relative flex-shrink-0 w-[280px] h-[220px] rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={getWorkshopImageUrl(item.image)}
              alt={item.title}
              fill
              className="object-cover hover:scale-105 transition-all duration-500"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-base font-bold">{item.title}</h3>
              <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Workshops() {
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

  return (
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

      {/* SOL PANEL - İçerik */}
      <div className="relative z-20 w-full lg:w-[40%] h-full flex flex-col justify-center px-12 md:px-16">
        {/* Sol panel gradient overlay - belirgin başlayıp sağa doğru belirsizleşir */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.4) 35%, transparent 50%)'
          }}
        />
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
          />
        ))}
      </div>
    </section>
  );
}
