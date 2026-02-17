'use client';

import React, { useRef, useEffect, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ShowcaseStackProps } from './sections/showcase/ShowcaseStack';

gsap.registerPlugin();

interface ScrollManagerProps {
  children: ReactNode;
}

export default function ScrollManager({ children }: ScrollManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showcaseCompleted, setShowcaseCompleted] = useState(false);
  const prevShowcaseCompletedRef = useRef(false);

  // ============================================
  // Initial Setup: z-index hierarchy for all sections
  // ============================================
  useEffect(() => {
    if (!containerRef.current) return;

    // Set z-index hierarchy for all sections
    const sectionZIndexes: Record<string, number> = {
      'hero': 10,
      'statement': 20,
      'brandgallery': 30,
      'about': 40,
      'services': 50,
      'showcase-stack': 60,
      'instructors': 70,
      'contact': 80,
    };

    Object.entries(sectionZIndexes).forEach(([section, zIndex]) => {
      const el = document.querySelector(`[data-section="${section}"]`) as HTMLElement;
      if (el) {
        gsap.set(el, { zIndex });
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
