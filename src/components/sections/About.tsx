// src/components/sections/About.tsx
'use client';
import { useRef, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAboutImageUrl } from '@/lib/constants';
import { aboutImage } from '@/data/about';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  title: string;
  content: string;
}

const splitTextToChars = (text: string): string[] => {
  return text.split('');
};

export default function About({ title, content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const titleChars = useMemo(() => splitTextToChars(title), [title]);
  const contentChars = useMemo(() => splitTextToChars(content), [content]);

  useGSAP(() => {
    // Title split text animasyonu - Karakterler sırayla gelir
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Content split text animasyonu
    if (contentRef.current) {
      const chars = contentRef.current.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Görsel animasyonu - Hafif parallax
    gsap.fromTo(
      imageRef.current,
      { y: 50, opacity: 0 },
      {
        y: -30,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="h-screen bg-black relative flex items-center px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto z-10">
        {/* Sol Taraf: Title + Content */}
        <div className="flex flex-col space-y-6 order-2 md:order-1">
          <h2 
            ref={titleRef}
            className="font-syne uppercase font-black text-[clamp(1.8rem,3.5vw,2.8rem)] text-white leading-tight"
          >
            {titleChars.map((char, index) => (
              <span 
                key={`${index}-${char}`} 
                className="char inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
          <p 
            ref={contentRef}
            className="font-cormorant text-xl md:text-2xl italic text-white/80 leading-relaxed max-w-xl"
          >
            {contentChars.map((char, index) => (
              <span 
                key={`${index}-${char}`} 
                className="char inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        </div>

        {/* Sağ Taraf: Image */}
        <div 
          ref={imageRef} 
          className="relative w-full aspect-[3/4] max-h-[70vh] order-1 md:order-2"
        >
          <Image
            src={getAboutImageUrl(aboutImage.image)}
            alt="About Timeright Production"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

