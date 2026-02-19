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
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Title'ı 3 mantıksal satıra böl
  const titleLines = useMemo(() => {
    const words = title.split(' ');
    const total = words.length;
    const perLine = Math.ceil(total / 3);
    
    return [
      words.slice(0, perLine).join(' '),
      words.slice(perLine, perLine * 2).join(' '),
      words.slice(perLine * 2).join(' '),
    ].filter(line => line.length > 0);
  }, [title]);

  useGSAP(() => {
    // Title - Merdiven deseni animasyonu (satır satır)
    const titleLineElements = titleRef.current?.children;
    if (titleLineElements) {
      gsap.fromTo(
        titleLineElements,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '40% top',
            scrub: 1,
          },
        }
      );
    }

    // Image - Parallax efekti (yukarı doğru kayma)
    gsap.fromTo(
      imageRef.current,
      { y: 100 },
      {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    // Content - Split text blur reveal (kelimeler sırayla)
    const contentWords = contentRef.current?.children;
    if (contentWords) {
      gsap.fromTo(
        contentWords,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            end: 'top 30%',
            scrub: 1.5,
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="h-[200vh] bg-black relative overflow-hidden"
    >
      {/* Top Padding - 20vh Nefes Alma Boşluğu */}
      <div className="h-[20vh]" />

      {/* Title + Image Alanı */}
      <div className="relative h-full">
        {/* Image - Sağda, Portrait (dikey) */}
        <div
          ref={imageRef}
          className="absolute right-0 top-[20vh] w-[45%] aspect-[3/4] rounded-lg overflow-hidden z-10"
        >
          <Image
            src={getAboutImageUrl(aboutImage.image)}
            alt="About Timeright Production"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        </div>

        {/* Title Stack - Merdiven Deseni (Soldan sağa overlap) */}
        <div
          ref={titleRef}
          className="absolute left-0 top-[20vh] z-30 px-8"
        >
          {titleLines.map((line, index) => (
            <div
              key={index}
              className="font-syne uppercase font-black text-[clamp(2.5rem,7vw,5rem)] text-white leading-tight mb-2"
              style={{
                marginLeft: `${index * 10}%`,
                textShadow: '0 4px 12px rgba(0,0,0,0.8)',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Content - Son 50vh'de, tam ortada */}
      <div className="h-[50vh] flex items-center justify-center px-8">
        <p
          ref={contentRef}
          className="font-cormorant text-2xl italic text-white/90 text-center max-w-3xl leading-relaxed"
        >
          {content.split(' ').map((word, index) => (
            <span key={index} className="inline-block">
              {word}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

