'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface NavLinks {
  home: string;
  about: string;
  services: string;
  team: string;
  contact: string;
}

interface ClientHeaderContentProps {
  navLinks: NavLinks;
  locale: string;
}

export default function ClientHeaderContent({ navLinks, locale }: ClientHeaderContentProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // GSAP Scroll-Up Reveal Logic
  useGSAP(() => {
    if (!headerRef.current) return;

    let showAnim = gsap.to(headerRef.current, {
      yPercent: -100, // Hide the header by moving it up by its height
      paused: true,
      duration: 0.3, // Smoother transition
      ease: "power2.out"
    });

    ScrollTrigger.create({
      start: 100, // Trigger starts after 100px of scroll, allowing header to be visible on Hero
      end: "max", // End at the bottom of the page
      onUpdate: (self) => {
        if (self.direction === 1 && window.scrollY > 100) { // Scrolling down and past Hero threshold
          showAnim.play();
        } else if (self.direction === -1 || window.scrollY <= 100) { // Scrolling up or at the top of the page
          showAnim.reverse();
        }
      }
    });

  }, { scope: headerRef });

  // Dynamic Background Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    // Call handleScroll once on mount to set initial state
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="flex justify-between items-center px-10 py-6">
        {/* Left side (Logo area) - currently empty */}
        <div></div>
        {/* Right side (Navigation) */}
        <nav>
          <ul className="flex gap-8 items-center">
            <li>
              <Link href={`/${locale}/`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
                {navLinks.home}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
                {navLinks.about}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/services`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
                {navLinks.services}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/team`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
                {navLinks.team}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
                {navLinks.contact}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
