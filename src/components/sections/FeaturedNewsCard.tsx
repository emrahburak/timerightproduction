'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsImageUrl } from '@/lib/constants';
import type { NewsItem } from '@/data/news';

interface FeaturedNewsCardProps {
  item: NewsItem;
  href: string;
  title: string;
  excerpt?: string;
  location?: string;
  viewAllLabel: string;
  categoryLabel: string;
}

export default function FeaturedNewsCard({ item, href, title, excerpt, location, viewAllLabel, categoryLabel }: FeaturedNewsCardProps) {
  return (
    <Link href={href} className="block group relative w-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-500">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        <Image
          src={getNewsImageUrl(item.image)}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-archivo font-medium uppercase tracking-wider bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            {categoryLabel}
          </span>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-8 z-10 pt-14 sm:pt-20 md:pt-24">
          <h3 className="font-syne font-bold text-white text-lg sm:text-2xl md:text-4xl lg:text-5xl uppercase tracking-wide mb-2 sm:mb-3 leading-tight line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="hidden sm:block font-cormorant text-white/80 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mb-3 md:mb-4">
              {excerpt}
            </p>
          )}
          {location && (
            <p className="font-archivo text-white/60 text-xs sm:text-sm mb-3 md:mb-4">
              {location}
            </p>
          )}
          <span className="inline-flex items-center gap-2 font-archivo text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
            {viewAllLabel}
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
