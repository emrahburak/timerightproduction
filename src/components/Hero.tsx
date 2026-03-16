'use client';

import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { getHeroImageUrl } from '@/lib/constants';
import { heroImage } from '@/data/hero';

interface HeroProps {
  title: string;
  description: string;
}

function ContentBlock({ title }: { title: string }) {
  return (
    <div className="flex items-center flex-shrink-0">
      <span className="font-syne text-white uppercase font-black text-[clamp(2rem,8vw,10rem)] tracking-[-0.02em]">
        {title}
      </span>
      <span className="font-syne text-white uppercase font-black text-[clamp(2rem,8vw,10rem)] tracking-[-0.02em] px-10 md:px-20 min-w-[2rem] md:min-w-[5rem]">
        -
      </span>
    </div>
  );
}

function ContentSet({ title }: { title: string }) {
  return (
    <div className="flex flex-shrink-0 w-1/2">
      {[1, 2, 3, 4].map((i) => (
        <ContentBlock key={i} title={title} />
      ))}
    </div>
  );
}

export default function Hero({ title, description }: HeroProps) {
  const container = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const descriptionChars = useMemo(
    () => description.split(''),
    [description]
  );

  useGSAP(() => {
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 60,
      ease: 'none',
    });

    // Description split text — scroll tetikli değil,
    // sayfa yüklenince gecikmeyle başlar
    const descChars = gsap.utils.toArray<HTMLSpanElement>(
      '.hero-desc-char'
    );
    gsap.set(descChars, {
      opacity: 0,
      y: 15,
    });
    gsap.to(descChars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.018,
      ease: 'power3.out',
      delay: 1.2,
    });
  }, { scope: container });

  return (
    <section id="home" ref={container} className="h-screen bg-black flex items-center justify-start overflow-hidden relative">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getHeroImageUrl(heroImage.image)}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div ref={marqueeRef} className="flex flex-nowrap min-w-max">
          <ContentSet title={title} />
          <ContentSet title={title} />
        </div>
      </div>

      {/* Description — Split Text */}
      {/* Desktop: sol alt | Mobile/Tablet: orta alt */}
      <div
        className="
          absolute z-20 bottom-10
          left-0 right-0
          flex justify-center
          px-6
          md:px-10
          lg:justify-start
          lg:left-12
          lg:right-auto
          lg:max-w-lg
        "
      >
        <p
          className="
            font-cormorant italic
            text-white/90 leading-[1.4]
            text-[clamp(1.25rem,2.2vw,1.85rem)]
            text-center
            lg:text-left
            tracking-wide
          "
        >
          {descriptionChars.map((char, index) => (
            char === '\n' ? (
              <br key={index} />
            ) : (
              <span
                key={index}
                className="hero-desc-char inline-block"
                style={{
                  display: char === ' ' ? 'inline' : 'inline-block'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )
          ))}
        </p>
      </div>
    </section>
  );
}
