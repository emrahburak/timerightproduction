'use client';

import React, { useRef, useEffect, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollManagerProps {
  children: ReactNode;
}

export default function ScrollManager({ children }: ScrollManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showcaseCompleted, setShowcaseCompleted] = useState(false);
  const prevShowcaseCompletedRef = useRef(false);

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

  // Track changes to showcaseCompleted
  useEffect(() => {
    const instructorsSection = document.querySelector('[data-section="instructors"]') as HTMLElement;
    const contactSection = document.querySelector('[data-section="contact"]') as HTMLElement;

    console.log('showcaseCompleted changed:', showcaseCompleted, 'prevShowcaseCompletedRef:', prevShowcaseCompletedRef.current);
    console.log('Instructors section found:', !!instructorsSection);
    console.log('Contact section found:', !!contactSection);

    if (showcaseCompleted && !prevShowcaseCompletedRef.current) {
      // Showcase completed - show instructors
      console.log('Showcase completed - showing instructors');
      
      if (instructorsSection) {
        console.log('Animating instructors section');
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
        console.log('Showing contact section');
        gsap.set(contactSection, {
          visibility: 'visible',
          zIndex: 10
        });
      }
      
      prevShowcaseCompletedRef.current = true;
    } else if (!showcaseCompleted && prevShowcaseCompletedRef.current) {
      // Scrolled back - hide instructors again
      console.log('Scrolled back - hiding instructors');
      
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

  // Function to find the ShowcaseStack child and update it
  const updateChildrenWithCallback = (children: ReactNode) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        // Check if this is the ShowcaseStack component by looking at props
        const childProps = child.props as Partial<ShowcaseStackProps>;
        if (childProps.messages?.academy && childProps.messages?.workshops) {
          // This appears to be ShowcaseStack, add the callback
          console.log('Found ShowcaseStack, adding onCompletion callback');
          return React.cloneElement(child, {
            onCompletion: setShowcaseCompleted
          });
        } else if (childProps.children) {
          // Recursively check nested children
          return React.cloneElement(child, {
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
