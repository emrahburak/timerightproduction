'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface HeroProps {
  title: string;
}

function ContentBlock({ title }: { title: string }) {
  return (
    <div className="flex items-center flex-shrink-0">
      <span className="font-syne text-white uppercase font-black text-[clamp(4rem,12vw,10rem)] tracking-[-0.02em]">
        {title}
      </span>
      <span className="font-syne text-white uppercase font-black text-[clamp(4rem,12vw,10rem)] tracking-[-0.02em] px-20 min-w-[5rem]">
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

export default function Hero({ title }: HeroProps) {
  const container = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 60,
      ease: 'none',
    });
  }, { scope: container });

  return (
    <section id="home" ref={container} className="h-screen bg-black flex items-center justify-start overflow-hidden">
      <div className="relative z-10 w-full overflow-hidden">
        <div ref={marqueeRef} className="flex flex-nowrap min-w-max">
          <ContentSet title={title} />
          <ContentSet title={title} />
        </div>
      </div>
    </section>
  );
}
