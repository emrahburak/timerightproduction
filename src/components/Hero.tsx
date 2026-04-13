'use client';

import { useRef, useMemo, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { getHeroImageUrl } from '@/lib/constants';
import { heroImage } from '@/data/hero';
import courses from '@/data/courses.json';
import { ArrowRight } from 'lucide-react';
import CourseApplicationModal from '@/components/ui/CourseApplicationModal';

interface HeroProps {
  title: string;
  description: string;
  applyButton: string;
  courseMessages: any;
  formMessages: any;
  actingServiceDescription: string;
  actingServiceTitle: string;
}

// Aktif kursları bul (isActive: true olanlar)
const activeCourses = courses.filter(c => c.isActive);
const defaultCourse = activeCourses.length > 0 ? activeCourses[0] : courses[0];

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

export default function Hero({ title, description, applyButton, courseMessages, formMessages, actingServiceDescription, actingServiceTitle }: HeroProps) {
  const container = useRef<HTMLDivElement>(null);
  
  const marqueeRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Pill animation
    if (pillRef.current) {
      gsap.fromTo(pillRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, { scope: container });

  return (
    <>
      <section id="home" ref={container} className="h-screen bg-[#0a0a0a] flex items-center justify-start overflow-hidden relative">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getHeroImageUrl(heroImage.image)}
            alt="Hero Background"
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
        </div>

        {/* Bottom Fade-out Overlay for transition to About section */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-[5]" />

        {/* Hero Pill / Badge for Course Announcement */}
        {activeCourses.length > 0 && (
          <div className="absolute top-[20%] md:top-[25%] left-0 right-0 flex justify-center z-30 px-4">
            <div 
              ref={pillRef}
              onClick={() => setIsModalOpen(true)}
              className="group cursor-pointer flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all duration-300"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs animate-pulse">
                🚀
              </span>
              <span className="text-sm font-medium text-white tracking-wide">
                {activeCourses.length > 1 
                  ? applyButton
                  : (courseMessages[activeCourses[0].id]?.pillLabel || applyButton)}
              </span>
              <ArrowRight size={16} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 w-full mt-10 md:mt-0">
          <div ref={marqueeRef} className="flex flex-nowrap min-w-max">
            <ContentSet title={title} />
            <ContentSet title={title} />
          </div>
        </div>

        {/* Description — Split Text */}
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

      {/* Application Modal */}
      <CourseApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseMessages={courseMessages}
        formMessages={formMessages}
        actingDescription={actingServiceDescription}
        actingTitle={actingServiceTitle}
      />
    </>
  );
}
