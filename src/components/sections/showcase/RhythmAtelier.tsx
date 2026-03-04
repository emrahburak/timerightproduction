'use client';

import Image from 'next/image';
import { getShowcaseStackUrl, getRitmImageUrl } from '@/lib/constants';
import { ritmImages } from '@/data/ritm';

const bgImageUrl = getShowcaseStackUrl('ritm', '');

export default function RhythmAtelier() {
  return (
    <section className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Image Layer - Management ile aynı pattern */}
      <Image
        src={bgImageUrl}
        alt="Ritm Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />

      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />

      {/* Ambience Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30 z-[1]" />

      {/* Ritm Images Grid - Yeni Eklendi */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {ritmImages.map((image, idx) => (
            <div 
              key={image}
              className="relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <Image
                src={getRitmImageUrl(image)}
                alt={`Ritm ${idx + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 45vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
