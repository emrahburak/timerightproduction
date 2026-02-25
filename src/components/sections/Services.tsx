'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import ServiceCard from './ServiceCard';
import { getServiceImageUrl } from '@/lib/constants';
import { serviceImage } from '@/data/services';

gsap.registerPlugin(ScrollTrigger);

// Hizmet Verileri
const servicesData = [
  {
    id: 1,
    title: 'Firma Tanıtım Filmleri',
    titleEn: 'Corporate Brand Films',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    id: 2,
    title: 'Belgesel Filmleri',
    titleEn: 'Documentary Productions',
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
  },
  {
    id: 3,
    title: 'Menajerlik Hizmetleri',
    titleEn: 'Talent Management',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    id: 4,
    title: 'Festival Organizasyon',
    titleEn: 'Festival & Events',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    id: 5,
    title: 'Motivasyon Etkinlikleri',
    titleEn: 'Motivation Events',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 6,
    title: 'Ritm Atölyesi',
    titleEn: 'Rhythm Workshops',
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
  const container = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageUrl = getServiceImageUrl(serviceImage.image);


  // Merge servicesData with passed items to get localized text with icons
  const mergedServices = servicesData.map((service, index) => {
    const item = items?.[index];
    return {
      ...service,
      titleEn: item ? item.title : service.titleEn,
      title: item ? item.description : service.title,
    };
  });

  useGSAP(
    () => {
      if (!wrapper.current) return;

      const mm = gsap.matchMedia();

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      }, (context) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { isMobile } = context.conditions as any;

        const scrollWidth = wrapper.current!.scrollWidth;
        const viewportWidth = window.innerWidth;

        gsap.set(wrapper.current, { x: viewportWidth });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${wrapper.current!.scrollWidth}`, 
            invalidateOnRefresh: true,
          },
        });

        tl.to(wrapper.current, {
          x: -scrollWidth, 
          ease: 'none',
        });

        const updateCards = () => {
          const centerPoint = window.innerWidth / 2;
          
          cardsRef.current.forEach((card) => {
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(centerPoint - cardCenter);
            
            const effectRange = window.innerWidth / (isMobile ? 1.2 : 1.5);
            const normDist = gsap.utils.clamp(0, 1, dist / effectRange);

            // Responsive Values
            const maxVerticalMove = isMobile ? 100 : 200;
            const edgeScale = isMobile ? 0.7 : 0.75;
            const rotationFactor = isMobile ? 0.04 : 0.03;

            const scale = gsap.utils.interpolate(1.1, edgeScale, normDist); 
            const yPos = gsap.utils.interpolate(0, maxVerticalMove, normDist);
            const rotate = (cardCenter - centerPoint) * rotationFactor; 

            gsap.set(card, {
              scale: scale,
              y: yPos,
              rotation: rotate,
              zIndex: 100 - Math.round(normDist * 100),
            });
          });
        };

        gsap.ticker.add(updateCards);
        
        // Return a cleanup function for the ticker
        return () => {
          gsap.ticker.remove(updateCards);
        };
      });

      // Return a cleanup function for matchMedia
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      id="services"
      ref={container}
      className="relative h-screen bg-black overflow-hidden flex flex-col justify-center"
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt="Services Background"
        fill
        className="absolute inset-0 z-0 opacity-20 object-cover"
      />
      {/* Top Fade-out Overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-50 z-[1]" />
      
      {/* Devasa Arkaplan Yazısı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-[30]">
        <h1 className="font-syne font-bold text-[15vw] leading-none text-white opacity-[0.03] select-none tracking-widest">
          {title || 'SERVICES'}
        </h1>
      </div>

      {/* Carousel Wrapper */}
      {/* 'flex items-center' ile kartları hizalıyoruz. 
          Başlangıç pozisyonunu GSAP 'set' ile yöneteceğiz, bu yüzden CSS ile ötelemeye gerek yok.
          Sadece container yüksekliğini ve dikey hizalamayı koruyoruz. */}
      <div className="w-full h-full absolute inset-0 flex items-center z-[40]">
        <div ref={wrapper} className="flex gap-12 md:gap-24 px-10 items-center">
          {mergedServices.map((service, index) => (
                        <ServiceCard
                          key={service.id}
                          ref={(el) => { cardsRef.current[index] = el; }}
                          service={service}
                        />          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.2em] uppercase animate-pulse z-[50]">
        {scrollToExplore}
      </div>
    </section>
  );
};

export default Services;