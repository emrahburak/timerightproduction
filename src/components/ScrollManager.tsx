'use client';

import React, { useRef, useEffect, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ShowcaseStackProps } from './sections/showcase/ShowcaseStack';

gsap.registerPlugin(ScrollTrigger);

interface ScrollManagerProps {
  children: ReactNode;
}

export default function ScrollManager({ children }: ScrollManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showcaseCompleted, setShowcaseCompleted] = useState(false);
  const prevShowcaseCompletedRef = useRef(false);

  // ============================================
  // Layered Sticky Reveal Animations
  // ============================================
  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // ============================================
    // 1. Statement → BrandGallery (Layered Sticky Reveal)
    // ============================================
    mm.add('@media (min-width: 768px)', () => {
      const statementSection = document.querySelector('[data-section="statement"]');
      const brandGallerySection = document.querySelector('[data-section="brandgallery"]');

      if (!statementSection || !brandGallerySection) return;

      // Scale kaldırıldı - 100vh korunacak
      gsap.set(brandGallerySection, { opacity: 0, y: 50, filter: 'blur(10px)' });

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: statementSection,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl1.to(brandGallerySection, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.inOut',
        duration: 1,
      });

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === statementSection) st.kill();
        });
      };
    });

    // ============================================
    // 2. BrandGallery → About (Layered Sticky Reveal)
    // ============================================
    mm.add('@media (min-width: 768px)', () => {
      const brandGallerySection = document.querySelector('[data-section="brandgallery"]');
      const aboutSection = document.querySelector('[data-section="about"]');

      if (!brandGallerySection || !aboutSection) return;

      gsap.set(aboutSection, { opacity: 0, y: 100, filter: 'blur(8px)' });

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: brandGallerySection,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl2.to(aboutSection, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.inOut',
        duration: 1,
      });

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === brandGallerySection) st.kill();
        });
      };
    });

    // ============================================
    // 3. Services → ShowcaseStack (Layered Sticky Reveal - Entrance Only)
    // CRITICAL: Do NOT interfere with ShowcaseStack's internal animation
    // ============================================
    mm.add('@media (min-width: 768px)', () => {
      const servicesSection = document.querySelector('[data-section="services"]');
      const showcaseSection = document.querySelector('[data-section="showcase-stack"]');

      if (!servicesSection || !showcaseSection) return;

      // Only set initial state - internal animation handles the rest
      gsap.set(showcaseSection, { opacity: 0, scale: 0.95 });

      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: servicesSection,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl3.to(showcaseSection, {
        opacity: 1,
        scale: 1,
        ease: 'power2.inOut',
        duration: 1,
      }, 0);

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === servicesSection) st.kill();
        });
      };
    });

    // ============================================
    // 4. Instructors → Contact (Layered Sticky Reveal)
    // ============================================
    mm.add('@media (min-width: 768px)', () => {
      const instructorsSection = document.querySelector('[data-section="instructors"]');
      const contactSection = document.querySelector('[data-section="contact"]');

      if (!instructorsSection || !contactSection) return;

      gsap.set(contactSection, { opacity: 0, scale: 0.9, filter: 'blur(10px)' });

      const tl4 = gsap.timeline({
        scrollTrigger: {
          trigger: instructorsSection,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl4.to(contactSection, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        ease: 'power2.inOut',
        duration: 1,
      });

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === instructorsSection) st.kill();
        });
      };
    });

    return () => mm.revert();
  }, { scope: containerRef });

  // ============================================
  // Initial setup for sections
  // ============================================
  useEffect(() => {
    if (!containerRef.current) return;

    const instructorsSection = document.querySelector('[data-section="instructors"]') as HTMLElement;
    const contactSection = document.querySelector('[data-section="contact"]') as HTMLElement;

    // Initially hide instructors section
    if (instructorsSection) {
      gsap.set(instructorsSection, {
        opacity: 0,
        y: 100
      });
    }

    // Initially hide contact section
    if (contactSection) {
      gsap.set(contactSection, {
        visibility: 'hidden',
        zIndex: 0
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // ============================================
  // Track changes to showcaseCompleted
  // ============================================
  useEffect(() => {
    const instructorsSection = document.querySelector('[data-section="instructors"]') as HTMLElement;
    const contactSection = document.querySelector('[data-section="contact"]') as HTMLElement;

    if (showcaseCompleted && !prevShowcaseCompletedRef.current) {
      // Showcase completed - show instructors
      if (instructorsSection) {
        gsap.to(instructorsSection, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'all',
          onComplete: () => {
            console.log('Instructors animation completed');
          }
        });
      }

      // Contact should always be visible for native scroll after instructors
      if (contactSection) {
        gsap.set(contactSection, {
          visibility: 'visible',
          zIndex: 10
        });
      }

      prevShowcaseCompletedRef.current = true;
    } else if (!showcaseCompleted && prevShowcaseCompletedRef.current) {
      // Scrolled back - hide instructors again
      if (instructorsSection) {
        gsap.to(instructorsSection, {
          opacity: 0,
          y: 100,
          duration: 1.2,
          ease: 'power3.in'
        });
      }

      // Hide contact while showcase is active
      if (contactSection) {
        gsap.set(contactSection, {
          visibility: 'hidden',
          zIndex: 0
        });
      }

      prevShowcaseCompletedRef.current = false;
    }
  }, [showcaseCompleted]);

  // ============================================
  // Function to find the ShowcaseStack child and update it
  // ============================================
  const updateChildrenWithCallback = (children: ReactNode): ReactNode => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        const childProps = child.props as Partial<ShowcaseStackProps> & { children?: ReactNode };
        if (childProps.messages?.academy && childProps.messages?.workshops) {
          return React.cloneElement(child, {
            onCompletion: setShowcaseCompleted
          } as Partial<ShowcaseStackProps>);
        } else if (childProps.children) {
          return React.cloneElement<any>(child, {
            children: updateChildrenWithCallback(childProps.children)
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
