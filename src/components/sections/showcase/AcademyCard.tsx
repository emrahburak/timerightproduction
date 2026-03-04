'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AcademyCardProps {
  title: string;
  icon: string;
  courses: string[];
  themeColor: 'blue' | 'amber' | 'purple';
}

const themeStyles = {
  blue: {
    gradient: 'from-[#B0CCBB] to-[#9AB1CA]',
    iconColor: 'text-[#272928]',
    bg: 'bg-[#212121]',
    titleColor: 'text-white',
    courseDot: 'bg-blue-400',
    courseText: 'text-white/70',
  },
  amber: {
    gradient: 'from-[#D4B89A] to-[#C9A97E]',
    iconColor: 'text-[#272928]',
    bg: 'bg-[#212121]',
    titleColor: 'text-white',
    courseDot: 'bg-amber-400',
    courseText: 'text-white/70',
  },
  purple: {
    gradient: 'from-[#B8A9D4] to-[#9A7EC9]',
    iconColor: 'text-[#272928]',
    bg: 'bg-[#212121]',
    titleColor: 'text-white',
    courseDot: 'bg-purple-400',
    courseText: 'text-white/70',
  },
};

const AcademyCard: React.FC<AcademyCardProps> = ({ title, icon, courses, themeColor }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const styles = themeStyles[themeColor];

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.fromTo(cardRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={`academy-card relative w-full sm:w-full md:w-full lg:w-[420px] h-auto sm:h-[300px] md:h-[300px] lg:h-[600px] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 group ${styles.bg}`}
    >
      {/* Mobile: Vertical | sm-md: Horizontal | lg+: Vertical */}
      <div className="flex flex-col sm:flex-row lg:flex-col h-full w-full">
        {/* Upper Section: Gradient & Icon */}
        <div className={`h-[200px] sm:h-full sm:w-1/3 lg:h-[45%] lg:w-full w-full bg-gradient-to-br ${styles.gradient} flex items-center justify-center p-3 sm:p-4 lg:p-8 relative overflow-hidden`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/10 blur-[50px] rounded-full" />

          <svg
            className={`w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-24 lg:h-24 ${styles.iconColor} transition-all duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d={icon}
            />
          </svg>
        </div>

        {/* Lower Section: Title & Courses */}
        <div className="flex-1 sm:h-full sm:w-2/3 lg:h-[55%] lg:w-full w-full bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center text-center sm:items-start sm:text-left lg:items-center lg:text-center justify-start sm:justify-start lg:justify-start pt-4 sm:pt-4 lg:pt-8 px-3 sm:px-4 lg:px-8 border-t sm:border-t sm:border-l lg:border-l-0 lg:border-t border-white/5 overflow-hidden">
          <h3 className={`font-syne font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl ${styles.titleColor} mb-2 sm:mb-3 lg:mb-6 tracking-wide uppercase`}>
            {title}
          </h3>

          {/* Courses List */}
          <ul className="space-y-0.5 sm:space-y-1 lg:space-y-1.5 overflow-y-auto max-h-[200px] sm:max-h-[180px] lg:max-h-[320px] pb-4 w-full">
            {courses.map((course) => (
              <li key={course} className="flex items-start gap-1.5 sm:gap-2 lg:gap-3 text-left">
                <span className={`${styles.courseDot} w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-1.5 sm:mt-2 flex-shrink-0`} />
                <span className={`font-cormorant text-xs sm:text-base md:text-lg lg:text-lg ${styles.courseText} leading-relaxed line-clamp-2`}>
                  {course}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcademyCard;
