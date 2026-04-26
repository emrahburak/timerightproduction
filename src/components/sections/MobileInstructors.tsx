'use client';
import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { getInstructorImageUrl } from '@/lib/constants';
import { type Instructor } from './Instructors';

interface MobileInstructorsProps {
  instructors: {
    title: string;
    description: string;
    members: Instructor[];
  };
}

export default function MobileInstructors({ instructors }: MobileInstructorsProps) {
  const { title, members } = instructors;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
      // Sola kaydır — ileri
      setActiveIndex(prev => (prev + 1) % members.length);
    } else {
      // Sağa kaydır — geri
      setActiveIndex(prev => (prev - 1 + members.length) % members.length);
    }
    touchStartX.current = null;
  };

  if (!members || members.length === 0) return null;

  return (
    <section
      id="instructors"
      className="w-full min-h-screen bg-black flex flex-col items-center justify-center px-6 py-16 relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Title */}
      <h2 className="font-syne font-black uppercase text-white text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12 tracking-wide self-start break-words w-full leading-tight">
        {title}
      </h2>

      {/* Slider Kapsayıcı */}
      <div className="w-full overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {members.map((member, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center text-center px-4"
            >
              {/* Yuvarlak Fotoğraf */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/20">
                <Image
                  src={getInstructorImageUrl(member.image)}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* İsim */}
              <h3 className="font-syne font-black uppercase text-white text-2xl leading-tight mb-1">
                {member.name}
              </h3>

              {/* Unvan */}
              <span className="font-syne text-sm uppercase tracking-widest text-white/40 mb-8">
                {member.title}
              </span>

              {/* Bio */}
              <p className="font-cormorant italic text-xl text-white/70 leading-relaxed max-w-sm">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex gap-1.5 mt-12">
        {members.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/25'
            }`}
            aria-label={`Go to ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
