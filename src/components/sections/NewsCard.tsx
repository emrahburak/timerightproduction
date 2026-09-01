'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsImageUrl } from '@/lib/constants';
import type { NewsItem } from '@/data/news';

interface NewsCardProps {
  item: NewsItem;
  href: string;
  title: string;
  excerpt?: string;
  categoryLabel: string;
}

export default function NewsCard({ item, href, title, excerpt, categoryLabel }: NewsCardProps) {
  return (
    <Link href={href} className="block group relative w-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-500">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={getNewsImageUrl(item.image)}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-archivo font-medium uppercase tracking-wider bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h4 className="font-syne font-bold text-white text-sm md:text-base uppercase tracking-wide mb-2 leading-snug line-clamp-2">
          {title}
        </h4>
        {excerpt && (
          <p className="font-cormorant text-white/60 text-sm leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
