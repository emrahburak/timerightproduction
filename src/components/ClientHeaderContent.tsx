'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface NavItem {
  label: string;
  path: string;
}

interface NavLinks {
  home: NavItem;
  about: NavItem;
  services: NavItem;
  team: NavItem;
  contact: NavItem;
  privacy?: string;
}

interface ClientHeaderContentProps {
  navLinks: NavLinks;
  locale: string;
}

export default function ClientHeaderContent({ navLinks, locale }: ClientHeaderContentProps) {
  const headerRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = Object.entries(navLinks)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null && 'path' in value) {
        return { key, ...value } as NavItem & { key: string };
      }
      return null;
    })
    .filter((item): item is NavItem & { key: string } => item !== null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    if (!pathname) return;
    router.push(`/${newLocale}${pathname.slice(3)}`);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (isMenuOpen) setIsMenuOpen(false);
    if (path.startsWith('#')) {
      gsap.to(window, { duration: 1.5, scrollTo: { y: path, offsetY: 0 }, ease: "power4.inOut" });
    } else {
      router.push(path);
    }
  };

  const scrollToTop = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: "power4.inOut" });
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMobile && isMenuOpen) setIsMenuOpen(false);
  }, [isMobile, isMenuOpen]);

  useGSAP(() => {
    if (!headerRef.current) return;
    const showAnim = gsap.from(headerRef.current, { yPercent: -100, paused: true, duration: 0.3, ease: "power2.out" }).progress(1);
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === -1) showAnim.play();
        else if (self.scroll() > 100) showAnim.reverse();
      }
    });
  }, { scope: headerRef });

  useGSAP(() => {
    if (!menuOverlayRef.current || !menuContentRef.current || !beamRef.current || !closeButtonRef.current) return;

    const overlay = menuOverlayRef.current;
    const content = menuContentRef.current;
    const beam = beamRef.current;
    const closeBtn = closeButtonRef.current;

    // Initial states
    gsap.set(overlay, { opacity: 0, visibility: 'hidden' });
    gsap.set(content, { y: '100%', opacity: 0 });
    gsap.set(beam, { y: '-100%', opacity: 0, scaleY: 0.3 });
    gsap.set(closeBtn, { scale: 0, opacity: 0 });

    if (isMenuOpen && isMobile) {
      // ===== OPENING: Beam rises from bottom, items follow =====
      
      gsap.set(overlay, { visibility: 'visible' });
      
      const openTl = gsap.timeline();

      // 1. Overlay fades in
      openTl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });

      // 2. BEAM: Rises from bottom to top (laser effect)
      // Start: wide in middle, end: thin line at top
      gsap.set(beam, { y: '100%', scaleY: 0.3 });
      openTl.to(beam, {
        y: '-120%',
        opacity: 1,
        scaleY: 1,
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0.1);

      // 3. Menu items rise from bottom to top (following beam)
      // They start when beam is at ~30% and finish when beam reaches top
      openTl.to(content, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0.3);

      // 4. Close button appears at end
      openTl.to(closeBtn, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(2)'
      }, 1.4);

    } else if (!isMenuOpen && isMobile) {
      // ===== CLOSING: Items go down first, then beam sweeps from top =====
      
      // Make sure overlay is visible before animation
      gsap.set(overlay, { visibility: 'visible', opacity: 1 });
      gsap.set(content, { y: 0, opacity: 1 });
      gsap.set(beam, { y: '-100%', opacity: 0, scaleY: 0.3 });
      
      const closeTl = gsap.timeline();

      // 1. Close button disappears first
      closeTl.to(closeBtn, {
        scale: 0,
        opacity: 0,
        duration: 0.15,
        ease: 'power3.in'
      }, 0);

      // 2. Menu items slide DOWN first (from y: 0 to y: '100%')
      closeTl.to(content, {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 0);

      // 3. BEAM: Sweeps from TOP to BOTTOM (laser cutting down)
      // Start from above viewport, expand in middle, shrink at bottom
      closeTl.to(beam, {
        y: '100%',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 0.3) // Starts after content begins moving
      .to(beam, {
        scaleY: 3,
        duration: 0.6,
        ease: 'power2.in'
      }, 0.3)
      .to(beam, {
        scaleY: 0.3,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      }, 0.8);

      // 4. Overlay fades at very end (after beam passes)
      closeTl.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlay, { visibility: 'hidden' });
        }
      }, 1.4);
    }
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-6">
          <button onClick={scrollToTop} className="z-[102] relative group cursor-pointer transition-opacity duration-300 hover:opacity-80">
            <div className="relative h-10 w-24 md:h-14 md:w-40">
              <Image src="/timeright.png" alt="Time Right Production" fill className="object-contain" priority />
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 items-center">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a href={item.path} onClick={(e) => handleSmoothScroll(e, item.path)} className="font-archivo text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 relative py-2 text-white hover:text-[#EAB308]">
                    {item.label}
                    <span className="absolute bottom-0 left-0 h-[1px] bg-[#EAB308] transition-all duration-300 w-0 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pl-8 border-l border-white/20 h-6">
              <button onClick={() => handleLocaleChange('tr')} className={`font-archivo text-xs uppercase tracking-widest transition-all duration-300 hover:scale-110 ${locale === 'tr' ? 'text-[#EAB308] font-bold' : 'text-white/40 hover:text-white'}`}>TR</button>
              <button onClick={() => handleLocaleChange('en')} className={`font-archivo text-xs uppercase tracking-widest transition-all duration-300 hover:scale-110 ${locale === 'en' ? 'text-[#EAB308] font-bold' : 'text-white/40 hover:text-white'}`}>EN</button>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button className="md:hidden z-[102] w-12 h-12 flex flex-col justify-center items-center gap-1.5" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <span className="block w-7 h-[1.5px] bg-white" />
            <span className="block w-7 h-[1.5px] bg-white" />
          </button>
        </div>
      </header>

      {/* Close Button */}
      <button ref={closeButtonRef} className={`fixed z-[200] w-12 h-12 flex items-center justify-center top-6 right-6 ${isMenuOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>
      </button>

      {/* Menu Overlay */}
      <div ref={menuOverlayRef} className="fixed inset-0 z-[101] bg-gray-900/40 backdrop-blur-xl flex flex-col justify-center items-center md:hidden opacity-0">
        
        {/* Beam - Separate laser element */}
        <div ref={beamRef} className="absolute left-0 w-full h-[600px] z-20 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0) 20%, rgba(236, 72, 153, 1) 40%, #ffffff 50%, rgba(236, 72, 153, 1) 60%, rgba(236, 72, 153, 0) 80%, transparent 100%)',
          filter: 'blur(8px)'
        }} />

        {/* Menu Content */}
        <div ref={menuContentRef} className="flex flex-col items-start gap-8 pl-8 z-30">
          <nav className="flex flex-col items-start gap-8">
            {navItems.map((item, index) => (
              <a key={item.key} href={item.path} onClick={(e) => handleSmoothScroll(e, item.path)} className="font-syne font-black text-5xl uppercase text-white hover:text-[#EAB308] transition-colors flex items-center gap-6">
                <span className="font-syne text-lg text-white/30">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Language Buttons */}
          <div className="mt-4 flex gap-6">
            <button onClick={() => handleLocaleChange('tr')} className={`font-syne text-lg uppercase px-6 py-3 border-2 rounded-full ${locale === 'tr' ? 'border-[#EAB308] text-[#EAB308] bg-[#EAB308]/10' : 'border-white/20 text-white/60'}`}>Türkçe</button>
            <button onClick={() => handleLocaleChange('en')} className={`font-syne text-lg uppercase px-6 py-3 border-2 rounded-full ${locale === 'en' ? 'border-[#EAB308] text-[#EAB308] bg-[#EAB308]/10' : 'border-white/20 text-white/60'}`}>English</button>
          </div>
        </div>

        <div className="absolute bottom-8 text-center z-30">
          <p className="font-archivo text-xs text-white/30 uppercase tracking-widest">TIME RIGHT PRODUCTION © 2026</p>
        </div>
      </div>
    </>
  );
}
