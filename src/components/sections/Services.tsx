"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getServiceImageUrl } from '@/lib/constants';
import { serviceImage } from '@/data/services';

const servicesData = [
  {
    id: 1,
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  },
  {
    id: 2,
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  },
  {
    id: 3,
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9',
  },
  {
    id: 4,
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    id: 5,
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
  },
  {
    id: 6,
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    id: 7,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    id: 8,
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
  {
    id: 9,
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  },
];

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesProps {
  title: string;
  items: ServiceItem[];
  scrollToExplore: string;
}

const Services = ({ title, items, scrollToExplore }: ServicesProps) => {
  const imageUrl = getServiceImageUrl(serviceImage.image);
  const [activeServiceId, setActiveServiceId] = useState(1);
  const [mobileSelectedId, setMobileSelectedId] = useState<number | null>(null);
  const scrollYRef = useRef(0);

  // Scroll lock: kilitleme/kilidi kaldırma
  useEffect(() => {
    if (mobileSelectedId !== null) {
      // Mevcut scroll pozisyonunu kaydet
      scrollYRef.current = window.scrollY;

      // Body'yi kilitle
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Lenis'i durdur
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    } else {
      // Body kilidini kaldır
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';

      // Scroll pozisyonunu geri yükle
      window.scrollTo(0, scrollYRef.current);

      // Lenis'i başlat
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileSelectedId]);

  // Escape tuşu ile kapatma
  useEffect(() => {
    if (mobileSelectedId === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSelectedId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileSelectedId]);

  // Ekran boyutu değişikliğinde kapatma (mobil değilse)
  useEffect(() => {
    if (mobileSelectedId === null) return;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSelectedId(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSelectedId]);

  const handleMobileSelect = useCallback((id: number) => {
    setMobileSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileSelectedId(null);
  }, []);

  const mergedServices = servicesData.map((service, index) => {
    const item = items?.[index];
    return {
      ...service,
      titleEn: item ? item.title : '',
      description: item ? item.description : '',
    };
  });

  const activeService = mergedServices.find((s) => s.id === activeServiceId) || mergedServices[0];

  return (
    <section
      id="services"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center py-24"
    >
      <Image
        src={imageUrl}
        alt="Services Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-50 z-[1]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[30]">
        <h1 className="font-syne font-bold text-[15vw] leading-none text-white opacity-[0.03] select-none tracking-widest">
          {title || 'SERVICES'}
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-[40]">
        {/* Desktop: Split-panel (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_3fr] lg:gap-12 lg:items-start">
          {/* Left: Sticky Service List */}
          <div className="sticky top-1/4">
            <div className="flex flex-col gap-2">
              {mergedServices.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`group flex items-center gap-4 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 text-left ${
                    activeServiceId === service.id
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Number */}
                  <span
                    className={`font-syne text-sm font-bold transition-colors duration-300 ${
                      activeServiceId === service.id
                        ? 'text-white'
                        : 'text-white/30 group-hover:text-white/50'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#B0CCBB]/20 to-[#9AB1CA]/20 border border-white/10 flex items-center justify-center transition-all duration-300 ${
                      activeServiceId === service.id ? 'scale-110 from-[#B0CCBB]/40 to-[#9AB1CA]/40' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={service.icon} />
                    </svg>
                  </div>

                  {/* Title */}
                  <span
                    className={`font-syne text-sm font-bold transition-colors duration-300 ${
                      activeServiceId === service.id
                        ? 'text-white'
                        : 'text-white/60 group-hover:text-white/80'
                    }`}
                  >
                    {service.titleEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active Service Description */}
          <div className="flex flex-col justify-center min-h-[50vh]">
            <div
              key={activeService.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3)] rounded-2xl p-10 lg:p-14"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B0CCBB]/30 to-[#9AB1CA]/30 border border-white/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={activeService.icon} />
                  </svg>
                </div>
                <h3 className="font-syne font-bold text-2xl lg:text-3xl text-white">
                  {activeService.titleEn}
                </h3>
              </div>
              <p className="font-cormorant text-xl lg:text-2xl text-white/70 leading-relaxed border-t border-white/5 pt-6">
                {activeService.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tablet: 2-column compact grid (md to lg) */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:hidden">
          {mergedServices.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center gap-4 py-4 px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <span className="font-syne text-xs font-bold text-white/30">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#B0CCBB]/20 to-[#9AB1CA]/20 border border-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={service.icon} />
                </svg>
              </div>
              <span className="font-syne text-sm font-bold text-white/80">
                {service.titleEn}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: Compact list + bottom sheet (below md) */}
        <div className="flex flex-col gap-1 md:hidden">
          {mergedServices.map((service, index) => (
            <button
              key={service.id}
              onClick={() => handleMobileSelect(service.id)}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 text-left min-h-[48px] ${
                mobileSelectedId === service.id
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/5 border border-transparent hover:bg-white/8 active:bg-white/10'
              }`}
            >
              <span className="font-syne text-xs font-bold text-white/30 w-5 text-right flex-shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#B0CCBB]/20 to-[#9AB1CA]/20 border border-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={service.icon} />
                </svg>
              </div>
              <span className="font-syne text-sm font-bold text-white/80 flex-grow min-w-0 truncate">
                {service.titleEn}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white/20 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          {mobileSelectedId && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                onClick={handleMobileClose}
                aria-hidden="true"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[110] md:hidden"
                role="dialog"
                aria-modal="true"
                aria-label={mergedServices.find((s) => s.id === mobileSelectedId)?.titleEn}
              >
                <div className="bg-[#141414] border-t border-white/10 rounded-t-2xl max-h-[70vh] flex flex-col">
                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleMobileClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
                    aria-label="Kapat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Content */}
                  <div className="px-6 pb-8 overflow-y-auto overscroll-contain">
                    {(() => {
                      const selected = mergedServices.find((s) => s.id === mobileSelectedId);
                      if (!selected) return null;
                      return (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B0CCBB]/30 to-[#9AB1CA]/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-white/80"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={selected.icon} />
                              </svg>
                            </div>
                            <h3 className="font-syne font-bold text-lg text-white">
                              {selected.titleEn}
                            </h3>
                          </div>
                          <p className="font-cormorant text-base text-white/70 leading-relaxed border-t border-white/5 pt-4">
                            {selected.description}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.2em] uppercase animate-pulse z-[50]">
        {scrollToExplore}
      </div>
    </section>
  );
};

export default Services;
