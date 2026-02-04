'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // 1. Force scroll to top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP gives time in seconds, Lenis wants milliseconds
    });

    // Disable GSAP's independent lag smoothing to avoid conflicts
    gsap.ticker.lagSmoothing(0);

    // Cleanup function
    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []); // Run once on mount

  return <>{children}</>;
}
