'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
  const members = instructors.members;
  const [currentIndex, setCurrentIndex] = useState(0); // Main Slot (B)
  const [secondaryIndex, setSecondaryIndex] = useState(members.length > 1 ? 1 : 0); // Side Slot (A)
  const [cursorSide, setCursorSide] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  // Buffer indices for seamless transitions
  const [nextBufferIndex, setNextBufferIndex] = useState((secondaryIndex + 1) % members.length);
  const [prevBufferIndex, setPrevBufferIndex] = useState((currentIndex - 1 + members.length) % members.length);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const slotARef = useRef<HTMLDivElement>(null); // Side Slot (Small)
  const slotBRef = useRef<HTMLDivElement>(null); // Main Slot (Large)
  const nextBufferRef = useRef<HTMLDivElement>(null); // Incoming from Left (Next flow)
  const prevBufferRef = useRef<HTMLDivElement>(null); // Incoming from Right (Prev flow)

  useGSAP(() => {
    if (!cursorRef.current) return;
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const centerX = window.innerWidth / 2;
      setCursorSide(e.clientX < centerX ? 'left' : 'right');
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  const handleNav = () => {
    if (isAnimating || members.length < 2) return;
    setIsAnimating(true);

    const isNext = cursorSide === 'right';
    
    // New indices to set after animation
    const newMain = isNext ? secondaryIndex : prevBufferIndex;
    const newSecondary = isNext ? nextBufferIndex : currentIndex;

    const tl = gsap.timeline({
      onComplete: () => {
        // Pixel-perfect state sync
        setCurrentIndex(newMain);
        setSecondaryIndex(newSecondary);
        setIsAnimating(false);
      }
    });

    // Determine direction for X movements
    const moveDir = isNext ? 1 : -1;

    // 1. Text Transition
    tl.to(textRef.current, {
      opacity: 0,
      y: isNext ? -10 : 10,
      duration: 0.3,
      ease: 'power2.in'
    }, 0);

    if (isNext) {
      // FORWARD FLOW
      // Main (B) -> Exits Right
      tl.to(slotBRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0);

      // Side (A) -> Becomes Main (B)
      // Single smooth movement: Pos + Width + Height
      tl.to(slotARef.current, {
        left: '35%',
        width: '60%',
        height: '85%',
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out'
      }, 0);

      // Next Buffer -> Enters Slot A from Left
      tl.fromTo(nextBufferRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      );
    } else {
      // BACKWARD FLOW
      // Main (B) -> Becomes Side (A)
      tl.to(slotBRef.current, {
        left: '5%',
        width: '30%',
        height: '60%',
        duration: 0.7,
        ease: 'power2.out'
      }, 0);

      // Side (A) -> Exits Left
      tl.to(slotARef.current, {
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0);

      // Prev Buffer -> Enters Slot B from Right
      tl.fromTo(prevBufferRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0
      );
    }
  };

  useEffect(() => {
    if (isAnimating) return;

    // Update buffers based on the new current state
    setNextBufferIndex((secondaryIndex + 1) % members.length);
    setPrevBufferIndex((currentIndex - 1 + members.length) % members.length);

    // Reset slots to base positions
    gsap.set(slotARef.current, { 
      left: '5%', width: '30%', height: '60%', x: 0, opacity: 1 
    });
    gsap.set(slotBRef.current, { 
      left: '35%', width: '60%', height: '85%', x: 0, opacity: 1 
    });
    gsap.set([nextBufferRef.current, prevBufferRef.current], { 
      opacity: 0, x: 0 
    });

    // Entrance Animation for text
    gsap.fromTo(textRef.current, 
      { opacity: 0, y: cursorSide === 'right' ? 20 : -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }, [currentIndex, secondaryIndex, isAnimating]);

  if (!members || members.length === 0) return null;

  return (
    <section
      id="instructors"
      ref={containerRef}
      onClick={handleNav}
      onMouseEnter={() => gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 })}
      onMouseLeave={() => gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 })}
      className="min-h-screen bg-black grid grid-cols-1 md:grid-cols-2 overflow-hidden relative z-10 cursor-none select-none shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
    >
      {/* 120px Glass Effect Cursor */}
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

      {/* Left Column: Seamless Carousel Reel */}
      <div className="relative h-[50vh] md:h-screen bg-transparent overflow-hidden">
        {/* NEXT BUFFER: Incoming from Left for Forward flow */}
        <div ref={nextBufferRef} className="absolute left-[5%] bottom-[10%] w-[30%] h-[60%] overflow-hidden z-0 opacity-0">
           <Image src={members[nextBufferIndex].image} alt="Next Buffer" fill className="object-cover grayscale" />
        </div>

        {/* PREV BUFFER: Incoming from Right for Backward flow */}
        <div ref={prevBufferRef} className="absolute left-[35%] bottom-[10%] w-[60%] h-[85%] overflow-hidden z-0 opacity-0 shadow-2xl">
           <Image src={members[prevBufferIndex].image} alt="Prev Buffer" fill className="object-cover" />
        </div>

        {/* SLOT A: Side Slot (Small) */}
        <div ref={slotARef} className="absolute left-[5%] bottom-[10%] w-[30%] h-[60%] overflow-hidden z-10">
           <Image src={members[secondaryIndex].image} alt="Secondary" fill className="object-cover grayscale" />
        </div>
        
        {/* SLOT B: Main Slot (Large) */}
        <div ref={slotBRef} className="absolute left-[35%] bottom-[10%] w-[60%] h-[85%] overflow-hidden z-20 shadow-2xl">
          <Image src={members[currentIndex].image} alt={members[currentIndex].name} fill className="object-cover" priority />
        </div>
      </div>

      {/* Right Column: Information */}
      <div className="flex flex-col justify-center px-10 md:px-20 py-20 relative z-30">
        <div ref={textRef}>
          <span className="font-archivo text-xs uppercase tracking-[0.3em] text-white/40 mb-4 block">
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

      <div className="absolute bottom-10 left-10 pointer-events-none opacity-[0.02] z-0">
        <span className="font-syne font-black text-[15vw] leading-none uppercase whitespace-nowrap">
          {instructors.title}
        </span>
      </div>
    </section>
  );
}