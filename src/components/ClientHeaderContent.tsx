'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Link from 'next/link';
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
}

interface ClientHeaderContentProps {
  navLinks: NavLinks;
  locale: string;
}

export default function ClientHeaderContent({ navLinks, locale }: ClientHeaderContentProps) {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
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

  const handleLocaleChange = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }

    if (path.startsWith('#')) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: path, offsetY: 0 },
        ease: "power4.inOut"
      });
    } else {
      router.push(path);
    }
  };

  const scrollToTop = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power4.inOut"
    });
  };

  // GSAP Scroll-Up Reveal Logic & Active State
  useGSAP(() => {
    if (!headerRef.current) return;

    // Header Reveal
    const showAnim = gsap.from(headerRef.current, { 
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: "power2.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
         if (self.direction === -1) {
           showAnim.play();
         } else if (self.direction === 1 && self.scroll() > 100) {
           showAnim.reverse();
         }
      }
    });

    // Active State Tracking
    navItems.forEach((item) => {
      // Defensive check: ensure path exists and is a hash link
      if (!item.path || !item.path.startsWith('#')) return;
      
      ScrollTrigger.create({
        trigger: item.path,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(item.path);
          }
        }
      });
    });

  }, { scope: headerRef, dependencies: [navItems] });

  // Mobile Menu Animation
  useGSAP(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.mobile-nav-item', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power3.out' }
      );
    } else {
      gsap.to(mobileMenuRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
    }
  }, [isMobileMenuOpen]);

  // Dynamic Background Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
          {/* Logo */}
          <button 
            onClick={scrollToTop}
            className="z-[102] relative group cursor-pointer transition-opacity duration-300 hover:opacity-80 flex items-center justify-center"
          >
            <div className="relative h-14 w-32 md:h-[80px] md:w-auto md:aspect-[2/1] overflow-hidden">
              <Image 
                src="/timeright.png" 
                alt="Time Right Production Logo" 
                fill
                className="object-contain object-center scale-150"
                priority
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 items-center">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a 
                    href={item.path}
                    onClick={(e) => handleSmoothScroll(e, item.path)}
                    className={`font-archivo text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 relative py-2 
                      ${activeSection === item.path ? 'text-[#EAB308]' : 'text-white hover:text-[#EAB308]'}
                    `}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-[1px] bg-[#EAB308] transition-all duration-300 ${activeSection === item.path ? 'w-full' : 'w-0'}`}></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Language Switcher */}
            <div className="flex items-center gap-3 pl-8 border-l border-white/20 h-6">
              <button
                onClick={() => handleLocaleChange('tr')}
                className={`font-archivo text-xs uppercase tracking-widest transition-all duration-300 hover:scale-110 ${
                  locale === 'tr' ? 'text-[#EAB308] font-bold' : 'text-white/40 hover:text-white'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => handleLocaleChange('en')}
                className={`font-archivo text-xs uppercase tracking-widest transition-all duration-300 hover:scale-110 ${
                  locale === 'en' ? 'text-[#EAB308] font-bold' : 'text-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-[102] relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'group-hover:w-6'}`} />
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 bg-black z-[101] flex flex-col justify-center items-center translate-x-full"
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.path}
              onClick={(e) => handleSmoothScroll(e, item.path)}
              className="mobile-nav-item font-syne font-bold text-4xl text-white uppercase hover:text-[#EAB308] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-12 flex items-center gap-6 mobile-nav-item">
          <button
            onClick={() => handleLocaleChange('tr')}
            className={`font-archivo text-sm uppercase tracking-widest px-4 py-2 border rounded-full transition-all ${
              locale === 'tr' ? 'border-[#EAB308] text-[#EAB308]' : 'border-white/20 text-white/40'
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => handleLocaleChange('en')}
            className={`font-archivo text-sm uppercase tracking-widest px-4 py-2 border rounded-full transition-all ${
              locale === 'en' ? 'border-[#EAB308] text-[#EAB308]' : 'border-white/20 text-white/40'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </>
  );
}