'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGalleryImageUrl } from '@/lib/constants';
import { newsItems } from '@/data/news';
import { galleryItems } from '@/data/gallery';
import FeaturedNewsCard from './FeaturedNewsCard';
import NewsCard from './NewsCard';

gsap.registerPlugin(ScrollTrigger);

interface BrandGalleryProps {
  locale: string;
  messages: {
    title: string;
    statement: string;
    featuredLabel: string;
    viewAllLabel: string;
    archiveLabel: string;
    categories: Record<string, string>;
    items: Record<string, {
      title: string;
      excerpt?: string;
      location?: string;
    }>;
  };
}

export default function BrandGallery({ locale, messages }: BrandGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  const featuredItems = newsItems.filter((item) => item.featured);
  const otherItems = newsItems.filter((item) => !item.featured);

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Grid cards stagger
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Archive strip reveal
      if (archiveRef.current) {
        gsap.fromTo(
          archiveRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: archiveRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden"
      data-section="brandgallery"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24 lg:py-32 max-w-[1400px]">
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <span className="font-archivo text-xs uppercase tracking-[0.2em] text-white/50 mb-4 block">
            {messages.featuredLabel}
          </span>
          <h2 className="font-syne font-black uppercase text-white text-[clamp(1.6rem,4vw,3rem)] leading-tight tracking-wide mb-4">
            {messages.title} 
          </h2>
          <p className="font-cormorant text-white/60 text-[clamp(1rem,1.8vw,1.3rem)] max-w-2xl leading-relaxed">
            {messages.statement}
          </p>
        </div>

        {/* Featured + Grid Layout */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Featured card - takes 2 cols */}
          {featuredItems.map((item) => {
            const itemText = messages.items[item.id] || { title: item.id };
            return (
              <div key={item.id} className="lg:col-span-2">
                <FeaturedNewsCard
                  item={item}
                  href={`/${locale}/news/${item.id}`}
                  title={itemText.title}
                  excerpt={itemText.excerpt}
                  location={itemText.location}
                  viewAllLabel={messages.viewAllLabel}
                  categoryLabel={messages.categories[item.category] || item.category}
                />
              </div>
            );
          })}

          {/* Other news cards */}
          {otherItems.map((item) => {
            const itemText = messages.items[item.id] || { title: item.id };
            return (
              <div key={item.id} className="lg:col-span-1">
                <NewsCard
                  item={item}
                  href={`/${locale}/news/${item.id}`}
                  title={itemText.title}
                  excerpt={itemText.excerpt}
                  categoryLabel={messages.categories[item.category] || item.category}
                />
              </div>
            );
          })}
        </div>

        {/* Visual Archive - Old gallery images */}
        {galleryItems.length > 0 && (
          <div ref={archiveRef}>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-archivo text-xs uppercase tracking-[0.2em] text-white/40">
                {messages.archiveLabel}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative w-full aspect-[3/4] overflow-hidden rounded-sm group"
                >
                  <Image
                    src={getGalleryImageUrl(item.image)}
                    alt={`Archive ${item.id}`}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-70 transition-all duration-500"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 11vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
