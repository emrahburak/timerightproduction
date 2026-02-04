'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  contact: {
    mainTitle: string;
    email: string;
    brandName: string;
    phoneLabels: { gsm: string; schweiz: string };
    phoneNumbers: { gsm: string; schweiz: string };
    socialHandle: string;
    copyright: string;
  };
}

export default function Contact({ contact }: ContactProps) {
  const containerRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Banner Reveal: Massive Title movement
    gsap.fromTo(bannerRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        }
      }
    );

    // 2. Core Content Reveal: Staggered Fade-in and slide
    gsap.fromTo('.reveal-item',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="contact"
      className="relative min-h-screen bg-black flex flex-col items-center justify-between py-24 overflow-hidden"
    >
      {/* 1. TOP LAYER: DEVASA BAŞLIK (The Banner) */}
      <div 
        ref={bannerRef}
        className="w-full text-center px-4"
      >
        <h2 className="font-syne font-extrabold uppercase text-[12vw] leading-none text-white tracking-tighter">
          {contact.mainTitle}
        </h2>
      </div>

      {/* 2. MERKEZİ ÇEKİRDEK (The Core Content) */}
      <div ref={coreRef} className="flex flex-col items-center justify-center text-center">
        <a 
          href={`mailto:${contact.email}`}
          className="reveal-item font-cormorant italic text-5xl md:text-7xl text-white hover:text-[#EAB308] transition-colors duration-500 mb-6"
        >
          {contact.email}
        </a>
        <h3 className="reveal-item font-archivo font-bold text-xl md:text-2xl tracking-tighter text-[#EAB308] uppercase">
          {contact.brandName}
        </h3>
      </div>

      {/* 3. ALT BİLGİLER (Details & Asymmetry) */}
      <div className="w-full px-10 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
        {/* Phone Numbers */}
        <div className="reveal-item flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="3" className="shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="font-archivo text-xs font-bold text-[#EAB308] tracking-widest uppercase">{contact.phoneLabels.gsm}</span>
            <a href={`tel:${contact.phoneNumbers.gsm}`} className="font-archivo text-white/80 hover:text-white transition-colors">
              {contact.phoneNumbers.gsm}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="3" className="shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="font-archivo text-xs font-bold text-[#EAB308] tracking-widest uppercase">{contact.phoneLabels.schweiz}</span>
            <a href={`tel:${contact.phoneNumbers.schweiz}`} className="font-archivo text-white/80 hover:text-white transition-colors">
              {contact.phoneNumbers.schweiz}
            </a>
          </div>
        </div>

        {/* Social and Copyright */}
        <div className="reveal-item flex flex-col items-end gap-6">
          <a 
            href="https://instagram.com/timerightproduction" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 font-syne font-bold text-lg text-white/60 hover:text-white transition-all group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#EAB308] transition-colors">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            {contact.socialHandle}
          </a>
          <p className="font-archivo text-[10px] text-white/20 tracking-[0.3em] uppercase">
            {contact.copyright}
          </p>
        </div>
      </div>
    </section>
  );
}
