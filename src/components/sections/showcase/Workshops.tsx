'use client';

import Image from 'next/image';
import { getWorkshopImageUrl } from '@/lib/constants';
import { workshopImages } from '@/data/workshops';

export default function Workshops() {
  return (
    <section className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Image Layer - Korunuyor */}
      <>
        <Image
          src={getWorkshopImageUrl(workshopImages[0])}
          alt="Workshop Background"
          fill
          className="absolute inset-0 z-0 opacity-20 object-cover"
        />
        {/* Top Fade-out Overlay - Korunuyor */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />

        {/* Ambience Layer - Korunuyor */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30 z-[1]" />
      </>

      {/* Masonry Gallery */}
      <div className="w-full h-full px-4 md:px-8 py-6 relative z-10 overflow-y-auto">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 md:gap-3">
          {workshopImages.map((image) => (
            <div
              key={image}
              className="relative mb-2 md:mb-3 overflow-hidden rounded-sm break-inside-avoid group"
            >
              <Image
                src={getWorkshopImageUrl(image)}
                alt={`Workshop ${image}`}
                width={400}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
