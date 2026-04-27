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

export default function About({ title, content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const titleWords = useMemo(() => title.split(' '), [title]);

  useGSAP(() => {
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

    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { y: 50, opacity: 0 },
        {
          y: -30,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 90%',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      data-section="about"
      className="min-h-screen md:h-screen bg-[#0a0a0a] relative isolate flex items-center px-8 md:px-16 lg:px-24 overflow-visible md:overflow-hidden py-16 md:py-0"
    >
      {/* Top Fade-in Overlay for transition from Hero section */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />
      
      {/* Background Ambience consistent with other sections */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent opacity-30 z-[1]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto z-10">
        {/* Sol Taraf: Title + Content */}
        <div className="flex flex-col space-y-6 order-1 md:order-1">
          <h2
            ref={titleRef}
            className="font-syne uppercase font-black text-[clamp(1.8rem,3.5vw,2.8rem)] text-white leading-tight"
          >
            {titleWords.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block whitespace-nowrap mr-[0.25em]"
              >
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p
            className="font-cormorant text-xl md:text-2xl italic text-white/80 leading-relaxed max-w-xl"
          >
            {content}
          </p>
        </div>

        {/* Sağ Taraf: Image */}
        <div
          ref={imageRef}
          className="relative w-full aspect-[3/4] max-h-[70vh] order-2 md:order-2 z-20 isolate"
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

