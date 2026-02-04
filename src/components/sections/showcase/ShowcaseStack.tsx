'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Academy from './Academy';
import Workshops from './Workshops';
import Management from './Management';
import RhythmAtelier from './RhythmAtelier';
import DigitalStage from './DigitalStage';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseStackProps {
  messages: {
    academy: { title: string; subtitle: string; description: string; stat: string };
    workshops: { title: string; subtitle: string; description: string; stat: string };
    management: { title: string; subtitle: string; description: string; stat: string };
    rhythmAtelier: { title: string; subtitle: string; description: string; stat: string };
    digitalStage: { title: string; subtitle: string; description: string; stat: string };
  };
}

const ShowcaseStack: React.FC<ShowcaseStackProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.showcase-item-wrapper');
    
    // Initial state: hide all sections except the first one below the viewport
    gsap.set(sections.slice(1), { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${sections.length * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Calculate which segment should be active based on progress (0.0 to 1.0)
          const progress = self.progress;
          const segmentIndex = Math.min(
            Math.floor(progress * sections.length),
            sections.length - 1
          );
          setActiveSegment(segmentIndex);
        }
      }
    });

    // Create a sequence where each section slides up to cover the previous one
    sections.forEach((section, i) => {
      if (i === 0) return;
      tl.to(section, {
        yPercent: 0,
        ease: "none"
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Local Navigation Line - Only visible when pinned */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`w-[2px] h-12 transition-colors duration-500 ${
              i <= activeSegment ? 'bg-white' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Stacked Sections */}
      <div className="showcase-item-wrapper absolute inset-0 z-10">
        <Academy {...messages.academy} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-20">
        <Workshops {...messages.workshops} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-30">
        <Management {...messages.management} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-40">
        <RhythmAtelier {...messages.rhythmAtelier} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-50">
        <DigitalStage {...messages.digitalStage} />
      </div>
    </div>
  );
};

export default ShowcaseStack;
