'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function lockBody() {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.overflow = 'hidden';
  (document.body.style as any).touchAction = 'none';
  (document.body.style as any).overscrollBehavior = 'none';
}

function unlockBody() {
  const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  document.body.style.overflow = '';
  (document.body.style as any).touchAction = '';
  (document.body.style as any).overscrollBehavior = '';
  window.scrollTo(0, scrollY);
}

function disableScrollTriggers() {
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(t => { t.disable(false); });
}

function enableScrollTriggers() {
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(t => { t.enable(); });
}

function setPointerEventsOutsideModal(disabled: boolean) {
  const selectors = [
    '[data-section="hero"]',
    '[data-section="about"]', 
    '[data-section="brandgallery"]',
    '[data-section="services"]',
    '[data-section="reelshowcase"]',
    '[data-section="showcase-stack"]',
    '[data-section="instructors"]',
    '[data-section="contact"]',
    'header',
    'nav'
  ];
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      (el as HTMLElement).style.pointerEvents = disabled ? 'none' : '';
    });
  });
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
    
    if (open) {
      lockBody();
      disableScrollTriggers();
      setPointerEventsOutsideModal(true);
    } else {
      enableScrollTriggers();
      unlockBody();
      setPointerEventsOutsideModal(false);
    }
  }, []);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen: handleOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
