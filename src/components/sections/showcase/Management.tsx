'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { getShowcaseStackUrl } from '@/lib/constants';

interface ManagementProps {
  title: string;
  subtitle: string;
  text: string[];
}

const Management: React.FC<ManagementProps> = ({ title, subtitle, text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrl = getShowcaseStackUrl('management', 'timeright-image-showcase-03.webp');

  return (
    <section
      ref={containerRef}
      className="management-section w-full min-h-screen md:h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative"
    >
      {/* Background Image Layer */}
      <Image
        src={imageUrl}
        alt="Management Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />

      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />

      {/* Bottom Fade-out Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-[2]" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black opacity-50 z-[1]" />

      <div className="container mx-auto px-6 md:px-10 py-16 md:py-0 flex flex-col items-center text-center relative z-10">

        {/* Title */}
        <h2 className="font-syne font-black text-[clamp(1.2rem,6vw,2.8rem)] text-white leading-tight uppercase mb-8 hyphens-none">
          {title}
        </h2>

        {/* 3D Text Container -> Now simple list container */}
        <div className="w-full max-w-2xl flex flex-col gap-3">
          {text.map((word, index) => (
            <span
              key={index}
              className="inline-flex items-center font-syne font-bold text-base md:text-xl lg:text-2xl text-white px-5 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm w-full md:w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/40 max-md:!ml-0 hyphens-none"
              style={{
                marginLeft: `${index * 1.5}rem`,
              }}
            >
              {/* Renkli dot */}
              <span
                className="flex-shrink-0 w-2 h-2 rounded-full mr-3"
                style={{
                  background: index === 0
                    ? '#3BAED4'
                    : index === 1
                      ? '#7B4FBE'
                      : index === 2
                        ? '#E0368C'
                        : index === 3
                          ? '#3BAED4'
                          : '#7B4FBE',
                }}
              />
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Background large text for texture */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-black text-[30vw] whitespace-nowrap leading-none">
          {title}
        </span>
      </div>
    </section>
  );
};

export default Management;
