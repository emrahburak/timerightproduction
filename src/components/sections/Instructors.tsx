'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getInstructorImageUrl } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface Instructor {
  name: string;
  title: string;
  bio: string;
  image: string;
}

interface SectionProps {
  instructors: {
    title: string;
    description: string;
    members: Instructor[];
  };
}

export default function Instructors({ instructors }: SectionProps) {
  const sectionTitle = instructors.title;
  const members = instructors.members;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(members.length > 1 ? 1 : 0);
  const [cursorSide, setCursorSide] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const [nextBufferIndex, setNextBufferIndex] = useState((secondaryIndex + 1) % members.length);
  const [prevBufferIndex, setPrevBufferIndex] = useState((currentIndex - 1 + members.length) % members.length);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const slotARef = useRef<HTMLDivElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const nextBufferRef = useRef<HTMLDivElement>(null);
  const prevBufferRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const relativeX = e.clientX - rect.left;
      
      const centerX = containerWidth / 2;
      
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power3"
      });
      
      setCursorSide(relativeX < centerX ? 'left' : 'right');
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current || !gridRef.current) return;

    const section = containerRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    tl.to(title, {
      y: -150,
      opacity: 0,
      ease: "power2.inOut",
    }, 0);

    tl.fromTo(grid, 
      { y: 100, opacity: 0.5 },
      { y: 0, opacity: 1, ease: "power2.inOut" },
      0
    );

  }, { scope: containerRef });

  const handleNav = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating || members.length < 2) return;
    
    let isNext = cursorSide === 'right';
    
    if ('touches' in e && e.touches.length > 0) {
      const touch = e.touches[0];
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = touch.clientX - rect.left;
        const centerX = rect.width / 2;
        isNext = relativeX >= centerX;
      }
    }
    
    setIsAnimating(true);
    
    const newMain = isNext ? secondaryIndex : prevBufferIndex;
    const newSecondary = isNext ? nextBufferIndex : currentIndex;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newMain);
        setSecondaryIndex(newSecondary);
        setIsAnimating(false);
      }
    });

    tl.to(textRef.current, {
      opacity: 0,
      y: isNext ? -10 : 10,
      duration: 0.3,
      ease: 'power2.in'
    }, 0);

    if (isNext) {
      tl.to(slotBRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut'
      }, 0);

      tl.to(slotARef.current, {
        left: '35%',
        width: '60%',
        height: '85%',
        opacity: 1,
        duration: 0.7,
        ease: 'power3.inOut'
      }, 0);

      tl.fromTo(nextBufferRef.current,
        { left: '35%', width: '60%', height: '85%', x: -50, opacity: 0 },
        { left: '5%', width: '30%', height: '60%', x: 0, opacity: 1, duration: 0.7, ease: 'power3.inOut' },
        0
      );
    } else {
      tl.to(slotBRef.current, {
        left: '5%',
        width: '30%',
        height: '60%',
        duration: 0.7,
        ease: 'power3.inOut'
      }, 0);

      tl.to(slotARef.current, {
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut'
      }, 0);

      tl.fromTo(prevBufferRef.current,
        { left: '5%', width: '30%', height: '60%', x: 50, opacity: 0 },
        { left: '35%', width: '60%', height: '85%', x: 0, opacity: 1, duration: 0.7, ease: 'power3.inOut' },
        0
      );
    }
  };

  useEffect(() => {
    if (isAnimating) return;

    setNextBufferIndex((secondaryIndex + 1) % members.length);
    setPrevBufferIndex((currentIndex - 1 + members.length) % members.length);

    gsap.set(slotARef.current, { 
      left: '5%', width: '30%', height: '60%', x: 0, opacity: 1 
    });
    gsap.set(slotBRef.current, { 
      left: '35%', width: '60%', height: '85%', x: 0, opacity: 1 
    });
    gsap.set(nextBufferRef.current, { 
      left: '5%', width: '30%', height: '60%', x: 0, opacity: 0 
    });
    gsap.set(prevBufferRef.current, { 
      left: '35%', width: '60%', height: '85%', x: 0, opacity: 0 
    });

    gsap.fromTo(textRef.current, 
      { opacity: 0, y: cursorSide === 'right' ? 20 : -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }, [currentIndex, secondaryIndex, isAnimating, members.length]);

  if (!members || members.length === 0) return null;

  return (
    <section
      id="instructors"
      ref={containerRef}
      onClick={handleNav}
      className="min-h-[150vh] bg-black relative z-10 cursor-pointer"
    >
      {/* 120px Glass Effect Cursor - Fixed position outside sticky */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-[120px] h-[120px] bg-white/30 backdrop-blur-md border border-white/20 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 opacity-0 flex items-center justify-center"
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="black" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${cursorSide === 'left' ? 'rotate-180' : ''}`}
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section Title - Top Left */}
        <div 
          ref={titleRef}
          className="absolute top-[5%] left-8 z-30"
        >
          <h2 className="font-syne text-6xl md:text-8xl font-black uppercase text-white">
            {sectionTitle}
          </h2>
        </div>

        {/* 50/50 Split Grid */}
        <div 
          ref={gridRef}
          className="absolute top-0 left-0 w-full h-full grid grid-cols-1 md:grid-cols-2 pt-32 md:pt-0"
        >
          {/* Left Column - Sticky Image */}
          <div 
            className="relative h-full flex items-center justify-center bg-black overflow-hidden"
            onMouseEnter={() => gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 })}
            onMouseLeave={() => gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 })}
          >

            {/* NEXT BUFFER */}
            <div ref={nextBufferRef} className="absolute left-[5%] bottom-[10%] w-[30%] h-[50%] overflow-hidden z-0 opacity-0">
              <Image src={getInstructorImageUrl(members[nextBufferIndex].image)} alt="Next Buffer" fill className="object-cover grayscale" />
            </div>

            {/* PREV BUFFER */}
            <div ref={prevBufferRef} className="absolute left-[35%] bottom-[10%] w-[60%] h-[70%] overflow-hidden z-0 opacity-0 shadow-2xl">
              <Image src={getInstructorImageUrl(members[prevBufferIndex].image)} alt="Prev Buffer" fill className="object-cover" />
            </div>

            {/* SLOT A: Side Slot (Small) */}
            <div ref={slotARef} className="absolute left-[5%] bottom-[10%] w-[30%] h-[50%] overflow-hidden z-10">
              <Image src={getInstructorImageUrl(members[secondaryIndex].image)} alt="Secondary" fill className="object-cover grayscale" />
            </div>
            
            {/* SLOT B: Main Slot (Large) */}
            <div ref={slotBRef} className="absolute left-[35%] bottom-[10%] w-[60%] h-[70%] overflow-hidden z-20 shadow-2xl">
              <Image src={getInstructorImageUrl(members[currentIndex].image)} alt={members[currentIndex].name} fill className="object-cover" priority />
            </div>
          </div>

          {/* Right Column - Info (Scrolls) */}
          <div 
            className="flex flex-col justify-center px-10 md:px-20 py-20 relative z-30"
            onMouseEnter={() => gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 })}
            onMouseLeave={() => gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 })}
          >
            <div ref={textRef}>
              <span className="font-archivo text-lg uppercase tracking-[0.3em] text-white/40 mb-4 block">
                {members[currentIndex].title}
              </span>
              <h2 className="font-syne text-5xl md:text-7xl uppercase text-white mb-6 leading-none">
                {members[currentIndex].name}
              </h2>
              <p className="font-archivo text-lg text-white/70 leading-relaxed max-w-xl">
                {members[currentIndex].bio}
              </p>

              <div className="mt-12 flex items-center gap-4">
                <span className="font-syne text-sm text-white/20">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <div className="w-12 h-[1px] bg-white/20"></div>
                <span className="font-syne text-sm text-white/20">
                  {String(members.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
