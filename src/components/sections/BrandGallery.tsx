// src/components/sections/BrandGallery.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { getGalleryImageUrl } from '@/lib/constants';
import { galleryItems } from '@/data/gallery';

export default function BrandGallery() {
  // 3x3 grid için ilk 9 item (elimizde 7 var, 2 boş slot kalacak)
  const displayItems = galleryItems.slice(0, 9);

  return (
    <section className="relative top-0 left-0 w-full h-screen bg-black overflow-hidden">
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
    </section>
  );
}
