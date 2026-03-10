'use client';

import React, { useRef, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGalleryImageUrl } from '@/lib/constants';
import { galleryItems } from '@/data/gallery';

gsap.registerPlugin(ScrollTrigger);

interface BrandGalleryProps {
  messages: {
    title: {
      brand: string;
      tagline: string;
    };
    statement: string;
  };
}

// Infinite loop için item'ları çoğalt
const createInfiniteItems = (items: typeof galleryItems, repeatCount = 4) => {
  const result: typeof galleryItems = [];
  for (let i = 0; i < repeatCount; i++) {
    result.push(...items.map((item) => ({
      ...item,
      id: item.id + (i * 100), // Unique ID için offset
    })));
  }
  return result;
};

export default function BrandGallery({ messages }: BrandGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);

  // Desktop: 3 sütun, Mobile: 2 sütun için veri hazırlığı
  const desktopColumns = useMemo(() => {
    const baseItems = galleryItems.slice(0, 9);
    const infiniteItems = createInfiniteItems(baseItems, 4);
    return {
      column1: infiniteItems.filter((_, index) => index % 3 === 0),
      column2: infiniteItems.filter((_, index) => index % 3 === 1),
      column3: infiniteItems.filter((_, index) => index % 3 === 2),
    };
  }, []);

  const mobileColumns = useMemo(() => {
    const baseItems = galleryItems.slice(0, 9);
    const infiniteItems = createInfiniteItems(baseItems, 4);
    return {
      column1: infiniteItems.filter((_, index) => index % 2 === 0),
      column2: infiniteItems.filter((_, index) => index % 2 === 1),
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      // Kalibre edilmiş mesafeler: 2.5 row görünür olması için optimize
      const moveDistance = isMobile ? 180 : 250;

      if (isMobile) {
        // Mobile: 2 sütun
        gsap.set(column1Ref.current, { y: moveDistance });
        gsap.set(column2Ref.current, { y: -moveDistance });

        gsap.to(column1Ref.current, {
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        });

        gsap.to(column2Ref.current, {
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        });
      } else {
        // Desktop: 3 sütun
        gsap.set(column1Ref.current, { y: moveDistance });
        gsap.set(column2Ref.current, { y: -moveDistance });
        gsap.set(column3Ref.current, { y: moveDistance });

        gsap.to(column1Ref.current, {
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        });

        gsap.to(column2Ref.current, {
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        });

        gsap.to(column3Ref.current, {
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  // Image component için ortak props
  const renderImage = (item: typeof galleryItems[0], prefix: string, sizes: string) => (
    <div
      key={`${prefix}-${item.id}`}
      className="relative w-full aspect-[3/4] max-h-[28vh] md:max-h-[32vh] overflow-hidden rounded-sm group"
    >
      <Image
        src={getGalleryImageUrl(item.image)}
        alt={`Brand ${item.id}`}
        fill
        className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
        sizes={sizes}
      />
    </div>
  );

  return (
    <section
      ref={containerRef}
      className="relative top-0 left-0 w-full h-screen bg-black overflow-hidden"
      data-section="brandgallery"
    >
      {/* Responsive Grid: Mobile 2 cols, Desktop 3 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-5 h-full w-full p-4 md:p-8">
        {/* Column 1 - Aşağıdan Yukarı ↑ */}
        <div ref={column1Ref} className="flex flex-col gap-2 md:gap-5 will-change-transform">
          {/* Mobile items */}
          <div className="md:hidden flex flex-col gap-2">
            {mobileColumns.column1.slice(0, 10).map((item) => renderImage(item, 'mob-c1', '45vw'))}
          </div>
          {/* Desktop items */}
          <div className="hidden md:flex flex-col gap-5">
            {desktopColumns.column1.slice(0, 10).map((item) => renderImage(item, 'desk-c1', '30vw'))}
          </div>
        </div>

        {/* Column 2 - Yukarıdan Aşağı ↓ */}
        <div ref={column2Ref} className="flex flex-col gap-2 md:gap-5 will-change-transform">
          {/* Mobile items */}
          <div className="md:hidden flex flex-col gap-2">
            {mobileColumns.column2.slice(0, 10).map((item) => renderImage(item, 'mob-c2', '45vw'))}
          </div>
          {/* Desktop items */}
          <div className="hidden md:flex flex-col gap-5">
            {desktopColumns.column2.slice(0, 10).map((item) => renderImage(item, 'desk-c2', '30vw'))}
          </div>
        </div>

        {/* Column 3 - Aşağıdan Yukarı ↑ (Desktop only) */}
        <div ref={column3Ref} className="hidden md:flex flex-col gap-5 will-change-transform">
          {desktopColumns.column3.slice(0, 10).map((item) => renderImage(item, 'desk-c3', '30vw'))}
        </div>
      </div>

      {/* Overlay Katman */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Başlık ve Statement - Overlay Üzerinde */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
        <h2 className="font-syne font-black text-[clamp(1.8rem,3.5vw,2.8rem)] text-white leading-tight uppercase text-center mb-6">
          <span className="block md:inline">{messages.title.brand}</span>
          <span className="block md:inline md:ml-4">{messages.title.tagline}</span>
        </h2>
        <p className="font-cormorant italic text-white/90 max-w-3xl text-center leading-relaxed text-[clamp(1.2rem,2.5vw,2rem)]">
          {messages.statement}
        </p>
      </div>
    </section>
  );
}
