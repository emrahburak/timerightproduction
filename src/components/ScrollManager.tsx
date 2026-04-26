'use client';

import React, { useRef, useEffect, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ShowcaseStackProps } from './sections/showcase/ShowcaseStack';

gsap.registerPlugin(ScrollTrigger);

interface ScrollManagerProps {
  children: ReactNode;
  isModalOpen?: boolean;
}

export default function ScrollManager({ children, isModalOpen = false }: ScrollManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showcaseCompleted, setShowcaseCompleted] = useState(false);
  const prevShowcaseCompletedRef = useRef(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // ============================================
  // Modal State: Disable ScrollTrigger when modal is open
  // (Now handled by ModalContext globally)
  // ============================================

  // ============================================
  // Initial Setup: z-index hierarchy for all sections
  // ============================================
  useEffect(() => {
    if (!containerRef.current) return;

    // Set z-index hierarchy for all sections
    const sectionZIndexes: Record<string, number> = {
      'hero': 10,
      'statement': 20,
      'brandgallery': 5,
      'about': 50,
      'services': 60,
      'reelshowcase': 65,
      'showcase-stack': 70,
      'instructors': 80,
      'contact': 90,
      'modal': 9999,
    };

    Object.entries(sectionZIndexes).forEach(([section, zIndex]) => {
      const el = document.querySelector(`[data-section="${section}"]`) as HTMLElement;
      if (el) {
        gsap.set(el, { zIndex });
      }
    });

    // Mobile'da about ve brandgallery
    // arasında kesin z-index ayırımı
    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      const aboutEl = document.querySelector(
        '[data-section="about"]'
      ) as HTMLElement;
      const brandGalleryEl = document.querySelector(
        '[data-section="brandgallery"]'
      ) as HTMLElement;

      if (aboutEl) {
        gsap.set(aboutEl, {
          zIndex: 50,
          position: 'relative',
        });
      }
      if (brandGalleryEl) {
        gsap.set(brandGalleryEl, {
          zIndex: 10,
          position: 'relative',
        });
      }
    });

    // Instructors: Hidden until ShowcaseStack completes
    const instructorsSection = document.querySelector('[data-section="instructors"]') as HTMLElement;
    if (instructorsSection) {
      gsap.set(instructorsSection, { opacity: 0, y: 100 });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // ============================================
  // Statement → BrandGallery "Perde Çekilme" Efekti
  // Statement yukarı kayarken, BrandGallery aşağıdan yukarı beliriyor
  // ============================================
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Statement → BrandGallery "Perde Çekilme" Efekti
      const statement = document.querySelector('[data-section="statement"]');
      const brandGallery = document.querySelector('[data-section="brandgallery"]');

      if (statement && brandGallery) {
        gsap.to(statement, {
          y: -100,
          opacity: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: statement,
            start: 'bottom top',
            end: 'top top',
            scrub: 1,
          },
        });

        gsap.fromTo(
          brandGallery,
          { y: 100 },
          {
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: brandGallery,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.5,
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // ============================================
  // Scroll-triggered Instructors reveal
  // When user scrolls to Instructors section, auto-set showcaseCompleted
  // ============================================
  useGSAP(() => {
    const instructorsEl = document.querySelector('[data-section="instructors"]');
    if (instructorsEl) {
      ScrollTrigger.create({
        trigger: instructorsEl,
        start: 'top bottom',
        onEnter: () => setShowcaseCompleted(true),
      });
    }
  }, []);

  // ============================================
  // ShowcaseStack Completion Handler
  // Shows Instructors section after ShowcaseStack animation completes
  // ============================================
  useEffect(() => {
    const instructorsSection = document.querySelector('[data-section="instructors"]') as HTMLElement;

    if (showcaseCompleted && !prevShowcaseCompletedRef.current) {
      // Showcase completed - reveal Instructors
      if (instructorsSection) {
        gsap.to(instructorsSection, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'all',
          onComplete: () => {
            console.log('Instructors animation completed');
          },
        });
      }

      prevShowcaseCompletedRef.current = true;
    } else if (!showcaseCompleted && prevShowcaseCompletedRef.current) {
      // Scrolled back - hide Instructors again
      if (instructorsSection) {
        gsap.to(instructorsSection, {
          opacity: 0,
          y: 100,
          duration: 1.2,
          ease: 'power3.in',
        });
      }

      prevShowcaseCompletedRef.current = false;
    }
  }, [showcaseCompleted]);

  // ============================================
  // Inject onCompletion callback into ShowcaseStack
  // ============================================
  const updateChildrenWithCallback = (children: ReactNode): ReactNode => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        const childProps = child.props as Partial<ShowcaseStackProps> & { children?: ReactNode };
        if (childProps.messages?.academy && childProps.messages?.workshops) {
          return React.cloneElement(child, {
            onCompletion: setShowcaseCompleted,
          } as Partial<ShowcaseStackProps>);
        } else if (childProps.children) {
          return React.cloneElement<any>(child, {
            children: updateChildrenWithCallback(childProps.children),
          });
        }
      }
      return child;
    });
  };

  return (
    <div ref={containerRef} className="w-full">
      {updateChildrenWithCallback(children)}
    </div>
  );
}
