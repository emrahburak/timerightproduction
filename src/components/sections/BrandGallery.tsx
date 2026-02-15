// src/components/sections/BrandGallery.tsx
'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Placeholder images - replace with actual brand images
const placeholderImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=600&fit=crop',
];

export default function BrandGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const col1InnerRef = useRef<HTMLDivElement>(null);
  const col2InnerRef = useRef<HTMLDivElement>(null);
  const col3InnerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop Animation (3 columns x 4 rows, show middle 2 rows)
    mm.add('(min-width: 768px)', () => {
      // Initial state: middle column wider
      gsap.set(col1Ref.current, { flex: '0 0 30%' });
      gsap.set(col2Ref.current, { flex: '0 0 40%' });
      gsap.set(col3Ref.current, { flex: '0 0 30%' });
      
      // Column 2 has offset for asymmetric look
      gsap.set(col2InnerRef.current, { y: '-12.5%' });
      
      // All columns start offset (first row above viewport)
      gsap.set([col1Ref.current, col2Ref.current, col3Ref.current], { y: '-25%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        },
      });

      // Animate columns: move up slightly to settle into position
      // End position: y: '-25%' (1st row hidden above), middle 2 rows visible
      tl.to(col1Ref.current, {
        y: '-25%',
        flex: '0 0 33.333%',
        duration: 1,
        ease: 'none',
      }, 0)
      .to(col2Ref.current, {
        y: '-25%',
        flex: '0 0 33.333%',
        duration: 1,
        ease: 'none',
      }, 0)
      .to(col3Ref.current, {
        y: '-25%',
        flex: '0 0 33.333%',
        duration: 1,
        ease: 'none',
      }, 0);

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === sectionRef.current) {
            st.kill();
          }
        });
      };
    });

    // Mobile Animation (2 columns x 4 rows, show middle 2 rows)
    mm.add('(max-width: 767px)', () => {
      // Column 2 has offset for asymmetric look
      gsap.set(col2InnerRef.current, { y: '-12.5%' });
      
      // Both columns start offset
      gsap.set(col1Ref.current, { y: '-25%' });
      gsap.set(col2Ref.current, { y: '-25%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1,
        },
      });

      // Columns settle into position
      tl.to(col1Ref.current, {
        y: '-25%',
        duration: 1,
        ease: 'none',
      }, 0)
      .to(col2Ref.current, {
        y: '-25%',
        duration: 1,
        ease: 'none',
      }, 0);

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === sectionRef.current) {
            st.kill();
          }
        });
      };
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Split images for columns (4 images per column)
  const col1Images = placeholderImages.slice(0, 4);
  const col2Images = placeholderImages.slice(4, 8);
  const col3Images = placeholderImages.slice(8, 12);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black w-full overflow-hidden"
    >
      <div
        ref={gridRef}
        className="flex flex-row md:flex-nowrap h-full w-full px-4 md:px-8 gap-2 md:gap-4"
      >
        {/* Column 1 */}
        <div
          ref={col1Ref}
          className="flex-1 h-full overflow-hidden"
        >
          <div ref={col1InnerRef} className="flex flex-col h-[200%]">
            {col1Images.map((src, index) => (
              <div
                key={`col1-${index}`}
                className="relative w-full h-1/4 flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Brand ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Offset for asymmetric look */}
        <div
          ref={col2Ref}
          className="flex-1 h-full overflow-hidden"
        >
          <div ref={col2InnerRef} className="flex flex-col h-[200%]">
            {col2Images.map((src, index) => (
              <div
                key={`col2-${index}`}
                className="relative w-full h-1/4 flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Brand ${index + 5}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Desktop only */}
        <div
          ref={col3Ref}
          className="hidden md:block flex-1 h-full overflow-hidden"
        >
          <div ref={col3InnerRef} className="flex flex-col h-[200%]">
            {col3Images.map((src, index) => (
              <div
                key={`col3-${index}`}
                className="relative w-full h-1/4 flex-shrink-0"
              >
                <Image
                  src={src}
                  alt={`Brand ${index + 9}`}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
