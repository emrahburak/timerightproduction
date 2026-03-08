'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Academy from './Academy';
import Workshops from './Workshops';
import Management from './Management';
import RhythmAtelier from './RhythmAtelier';

gsap.registerPlugin(ScrollTrigger);

export interface ShowcaseStackProps {
  messages: {
    academy: {
      title: string;
      subtitle: string;
      description: string;
      stat: string;
      programs: {
        acting: { title: string; courses: string[] };
        writing: { title: string; courses: string[] };
        rhythm: { title: string; courses: string[] };
      };
    };
    workshops: { title: string; paragraph1: string; paragraph2: string };
    management: { title: string; subtitle: string; text: string[] };
    rhythmAtelier: { title: string };
  };
  onCompletion?: (completed: boolean) => void;
}

const ShowcaseStack: React.FC<ShowcaseStackProps> = ({ messages, onCompletion }) => {
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

          // Check if animation is completed
          if (onCompletion) {
            const isCompleted = progress >= 0.99;
            console.log('ShowcaseStack onUpdate - progress:', progress, 'isCompleted:', isCompleted);
            onCompletion(isCompleted);
          }
        },
        onLeave: () => {
          console.log('ShowcaseStack onLeave - marking as completed');
          if (onCompletion) {
            onCompletion(true);
          }
        },
        onLeaveBack: () => {
          console.log('ShowcaseStack onLeaveBack - marking as not completed');
          if (onCompletion) {
            onCompletion(false);
          }
        },
        onEnter: () => {
          console.log('ShowcaseStack onEnter - marking as not completed');
          if (onCompletion) {
            onCompletion(false);
          }
        },
        onEnterBack: () => {
          console.log('ShowcaseStack onEnterBack - marking as not completed');
          if (onCompletion) {
            onCompletion(false);
          }
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
    <div ref={containerRef} className="showcase-stack-container relative w-full h-screen overflow-hidden bg-black">
      {/* Local Navigation Line - Only visible when pinned */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:bottom-auto md:left-10 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-[60] flex flex-row md:flex-col gap-3 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-8 h-[2px] md:w-[2px] md:h-12 transition-colors duration-500 ${
              i <= activeSegment ? 'bg-white' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Stacked Sections */}
      <div className="showcase-item-wrapper absolute inset-0 z-10">
        <Academy programs={messages.academy.programs} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-20">
        <Workshops messages={messages.workshops} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-30">
        <Management {...messages.management} />
      </div>
      <div className="showcase-item-wrapper absolute inset-0 z-40">
        <RhythmAtelier messages={messages.rhythmAtelier} />
      </div>
    </div>
  );
};

export default ShowcaseStack;
