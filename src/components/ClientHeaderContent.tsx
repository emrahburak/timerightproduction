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
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
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
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power4.inOut"
    });
  };

  // Body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // GSAP Scroll-Up Reveal Logic
  useGSAP(() => {
    if (!headerRef.current) return;

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
  }, { scope: headerRef });

  // Menu Animation
  useGSAP(() => {
    if (!menuRef.current || !menuItemsRef.current) return;

    if (isMenuOpen) {
      // Open menu
      gsap.to(menuRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
      
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.8,
        ease: 'power4.inOut'
      });

      gsap.fromTo(menuItemsRef.current.children, 
        { y: 80, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          delay: 0.3, 
          ease: 'power3.out' 
        }
      );
    } else {
      // Close menu
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.6,
        ease: 'power4.inOut'
      });

      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: 0.3,
        ease: 'power3.out'
      });
    }
  }, [isMenuOpen]);

  // Dynamic Background Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                    className="font-archivo text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 relative py-2 text-white hover:text-[#EAB308]"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 h-[1px] bg-[#EAB308] transition-all duration-300 w-0 group-hover:w-full"></span>
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

          {/* Hamburger Menu Toggle */}
          <button 
            className="md:hidden z-[102] relative w-12 h-12 flex flex-col justify-center items-center gap-1.5 group"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : 'group-hover:w-8'}`} />
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'group-hover:w-6'}`} />
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : 'group-hover:w-8'}`} />
          </button>

          {/* Desktop Hamburger (Hidden on mobile) */}
          <button 
            className="hidden md:flex z-[102] relative w-12 h-12 flex-col justify-center items-center gap-1.5 group"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : 'group-hover:w-8'}`} />
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'group-hover:w-6'}`} />
            <span className={`block w-8 h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : 'group-hover:w-8'}`} />
          </button>
        </div>
      </header>

      {/* Full-Screen Hamburger Menu Overlay */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-[101] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center"
        style={{ 
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          opacity: 0
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#EAB308]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#EAB308]/3 rounded-full blur-[100px]" />
        </div>

        {/* Menu Content */}
        <nav ref={menuItemsRef} className="flex flex-col items-center gap-6 md:gap-10 z-10">
          {navItems.map((item, index) => (
            <a
              key={item.key}
              href={item.path}
              onClick={(e) => handleSmoothScroll(e, item.path)}
              className="menu-link font-syne font-black text-5xl md:text-7xl lg:text-8xl uppercase text-white hover:text-[#EAB308] transition-colors duration-300 cursor-pointer relative group"
              style={{ 
                textShadow: '0 0 40px rgba(234, 179, 8, 0)'
              }}
            >
              <span className="relative z-10 inline-block">
                {item.label}
              </span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#EAB308]">
                —
              </span>
            </a>
          ))}
        </nav>

        {/* Language Switcher in Menu */}
        <div className="mt-16 flex items-center gap-6 z-10">
          <button
            onClick={() => handleLocaleChange('tr')}
            className={`font-syne text-lg uppercase tracking-widest px-6 py-3 border-2 rounded-full transition-all duration-300 ${
              locale === 'tr' 
                ? 'border-[#EAB308] text-[#EAB308] bg-[#EAB308]/10' 
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            Türkçe
          </button>
          <button
            onClick={() => handleLocaleChange('en')}
            className={`font-syne text-lg uppercase tracking-widest px-6 py-3 border-2 rounded-full transition-all duration-300 ${
              locale === 'en' 
                ? 'border-[#EAB308] text-[#EAB308] bg-[#EAB308]/10' 
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            English
          </button>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="font-archivo text-xs text-white/30 uppercase tracking-widest">
            TIME RIGHT PRODUCTION © 2026
          </p>
        </div>

        {/* Menu Number Indicators */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-10">
          {navItems.map((_, index) => (
            <span 
              key={index} 
              className="font-syne text-xs text-white/20 uppercase tracking-widest"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
