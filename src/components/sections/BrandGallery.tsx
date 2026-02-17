'use client';

// src/components/sections/BrandGallery.tsx
import React from 'react';
import Image from 'next/image';
import { getGalleryImageUrl } from '@/lib/constants';
import { galleryItems } from '@/data/gallery';

interface BrandGalleryProps {
  messages: {
    title: {
      brand: string;
      tagline: string;
    };
  };
}

export default function BrandGallery({ messages }: BrandGalleryProps) {
  // 3x3 grid için ilk 9 item
  const displayItems = galleryItems.slice(0, 9);

  return (
    <section className="relative top-0 left-0 w-full h-screen bg-black overflow-hidden">
      {/* Grid - Görseller */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 h-full w-full p-4 md:p-8">
        {displayItems.map((item) => (
          <div
            key={`brand-${item.id}`}
            className="relative w-full h-full overflow-hidden rounded-sm"
          >
            <Image
              src={getGalleryImageUrl(item.image)}
              alt={`Brand ${item.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay Katman - Hafif yumuşatma */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Başlık - Overlay Üzerinde */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-syne uppercase font-black tracking-[-0.02em] text-center px-4">
          <span className="block md:inline">{messages.title.brand}</span>
          <span className="block md:inline md:ml-4">{messages.title.tagline}</span>
        </h2>
      </div>
    </section>
  );
}
