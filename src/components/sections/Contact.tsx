'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParams } from 'next/navigation';
import PrivacyContent from '@/components/PrivacyContent';

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
  privacy: {
    title: string;
    content: string;
    back: string;
  };
  privacyLabel: string;
}

export default function Contact({ contact, privacy, privacyLabel }: ContactProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const coreContentRef = useRef<HTMLDivElement>(null);
  const privacyOverlayRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const locale = params.locale as string;

  useGSAP(() => {
    // 1. UNVEIL EFFECT (Whole section reveal)
    gsap.fromTo(contentWrapperRef.current,
      { scale: 0.8, opacity: 0.5, filter: 'blur(10px)' },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'body',
          start: 'bottom 150%',
          end: 'bottom bottom',
          scrub: 1,
        }
      }
    );

    // 2. PARALLAX EFFECT for Center Content
    gsap.to(coreContentRef.current, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'bottom 120%',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // 3. INFINITE MARQUEE
    if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
            xPercent: -50, 
            ease: "none",
            duration: 20,
            repeat: -1
        });
    }

  }, { scope: containerRef });

  const openPrivacy = () => {
    if (!privacyOverlayRef.current) return;
    gsap.to(privacyOverlayRef.current, { y: '0%', duration: 1, ease: 'power4.inOut' });
    window.history.pushState({ privacy: true }, '', `/${locale}/privacy`);
  };

  const closePrivacy = () => {
    // If we have history state, go back (triggering popstate). 
    // Otherwise just animate down (fallback).
    if (window.history.state?.privacy) {
        window.history.back(); 
    } else {
        // Manually animate if no history state (e.g. reload or edge case)
        if (!privacyOverlayRef.current) return;
        gsap.to(privacyOverlayRef.current, { y: '100%', duration: 1, ease: 'power4.inOut' });
        // Ensure URL is clean if we manually closed without back
        if (window.location.pathname.includes('privacy')) {
             window.history.replaceState(null, '', `/${locale}`);
        }
    }
  };

  // Handle Browser Back Button (PopState)
  useEffect(() => {
    const handlePopState = () => {
       if (!privacyOverlayRef.current) return;
       const isPrivacy = window.location.pathname.includes('privacy');
       if (!isPrivacy) {
          gsap.to(privacyOverlayRef.current, { y: '100%', duration: 1, ease: 'power4.inOut' });
       } else {
          // If forward button pressed to privacy?
          gsap.to(privacyOverlayRef.current, { y: '0%', duration: 1, ease: 'power4.inOut' });
       }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Check initial load (if loaded on /privacy, though Next.js Page handles that, 
    // but if we are in this component, we assume we are at Contact)
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <section 
        ref={containerRef}
        id="contact"
        className="fixed bottom-0 left-0 w-full h-screen z-0 bg-black overflow-hidden flex flex-col items-center justify-center"
      >
        <div ref={contentWrapperRef} className="w-full h-full relative flex flex-col items-center justify-center">
          
          {/* 1. SOL ÜST KÖŞE (The Signature) */}
          <div className="absolute top-10 left-10 z-20 hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-archivo">
              Design Inspired by Michael Aust | Developed with AI by elkasar
            </p>
          </div>

          {/* SAĞ ÜST KÖŞE (Privacy Link) */}
          <button 
            onClick={openPrivacy}
            className="absolute top-10 right-10 z-20 text-[10px] uppercase tracking-widest text-white/40 hover:text-[#EAB308] transition-colors font-archivo"
          >
            {privacyLabel}
          </button>

          {/* 2. MERKEZİ ALAN (The Core) */}
          <div ref={coreContentRef} className="flex flex-col items-center justify-center text-center z-10 px-4 relative top-[-5vh]">
              {/* A) BRAND */}
              <h2 className="text-white font-syne font-bold text-2xl md:text-4xl tracking-[0.2em] mb-6">
                  {contact.brandName}
              </h2>

              {/* B) EMAIL */}
              <a 
                href={`mailto:${contact.email}`}
                className="font-cormorant italic text-4xl md:text-6xl text-white/90 hover:text-[#EAB308] transition-colors mb-10 block"
              >
                {contact.email}
              </a>

              {/* C) NUMBERS */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
                  <div className="flex flex-col items-center gap-2">
                      <span className="text-[#EAB308] font-archivo text-xs md:text-sm font-bold tracking-widest">
                          {contact.phoneLabels.gsm}
                      </span>
                      <a href={`tel:${contact.phoneNumbers.gsm}`} className="text-white font-archivo text-lg hover:text-white/80 transition-colors">
                          {contact.phoneNumbers.gsm}
                      </a>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                      <span className="text-[#EAB308] font-archivo text-xs md:text-sm font-bold tracking-widest">
                          {contact.phoneLabels.schweiz}
                      </span>
                      <a href={`tel:${contact.phoneNumbers.schweiz}`} className="text-white font-archivo text-lg hover:text-white/80 transition-colors">
                          {contact.phoneNumbers.schweiz}
                      </a>
                  </div>
              </div>

              {/* D) SOCIAL */}
              <a 
                href="https://instagram.com/timerightproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="font-syne font-bold text-lg text-white hover:text-[#EAB308] transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
              >
                  {contact.socialHandle}
              </a>
          </div>

          {/* 3. EN ALT: AKAN YAZI (Marquee) */}
          <div className="absolute bottom-10 md:bottom-0 left-0 w-full overflow-hidden z-0 pointer-events-none pb-4 opacity-20">
              <div ref={marqueeRef} className="flex whitespace-nowrap w-max">
                  <div className="flex items-center gap-8 px-4">
                      <span className="font-syne font-black text-[15vw] md:text-[8vw] text-white leading-none">
                          {contact.mainTitle}
                      </span>
                      <span className="font-syne font-black text-[15vw] md:text-[8vw] text-transparent stroke-white stroke-2 leading-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                          {contact.mainTitle}
                      </span>
                  </div>
                  <div className="flex items-center gap-8 px-4">
                      <span className="font-syne font-black text-[15vw] md:text-[8vw] text-white leading-none">
                          {contact.mainTitle}
                      </span>
                      <span className="font-syne font-black text-[15vw] md:text-[8vw] text-transparent stroke-white stroke-2 leading-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                          {contact.mainTitle}
                      </span>
                  </div>
              </div>
          </div>

        </div>
      </section>

      {/* PRIVACY OVERLAY - Fixed over EVERYTHING */}
      <div 
        ref={privacyOverlayRef}
        className="fixed inset-0 z-[100] translate-y-full will-change-transform"
      >
        <PrivacyContent 
          title={privacy.title} 
          content={privacy.content} 
          backLabel={privacy.back}
          onBack={closePrivacy}
        />
      </div>
    </>
  );
}
