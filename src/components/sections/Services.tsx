'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  {
    id: 7,
    title: 'Dijital Sahne',
    titleEn: 'Digital Performances',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
];

interface ServiceItem {
  title: string;
  description: string;
}

interface ServicesProps {
  title: string;
  items: ServiceItem[];
}

const Services = ({ title, items }: ServicesProps) => {
  const container = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // 1. Hesaplamalar
      // Wrapper'ın toplam genişliği
      const scrollWidth = wrapper.current.scrollWidth;
      // Viewport genişliği
      const viewportWidth = window.innerWidth;
      
      // HAREKET MANTIĞI:
      // Başlangıç: Wrapper ekranın sağına yaslanmış veya biraz dışarıda (bunu CSS veya set ile yaparız).
      // Bitiş: Wrapper tamamen sola kaymış, son kart ekranı terk etmiş.
      // Toplam gidilecek yol = Wrapper Genişliği + Ekran Genişliği (tam geçiş için)
      // Ancak daha kontrollü bir akış için: 
      // x: - (scrollWidth - viewportWidth) -> Sona kadar git
      // x: - scrollWidth -> Tamamen ekran dışına çıkar.
      
      // Biz "Sağdan Sola" akış istiyoruz. 
      // Kartlar başlangıçta sağda olmalı.
      gsap.set(wrapper.current, { x: viewportWidth }); 

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          // Daha uzun bir scroll mesafesi vererek hareketi yavaşlatıyor ve hissi güçlendiriyoruz.
          end: '+=400%', 
          invalidateOnRefresh: true,
        },
      });

      // Animasyon: Wrapper'ı sağdan (x: viewportWidth) sola (x: -scrollWidth) taşıyoruz.
      // Bu sayede tüm kartlar ekranın önünden geçip gidiyor.
      tl.to(wrapper.current, {
        x: -scrollWidth, 
        ease: 'none',
      });

      // 2. Kavis (Arc) Efekti Hesaplayıcısı
      const updateCards = () => {
        const centerPoint = window.innerWidth / 2;
        
        cardsRef.current.forEach((card) => {
          if (!card) return;

          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          
          // Kartın merkezden uzaklığı
          const dist = Math.abs(centerPoint - cardCenter);
          
          // Etki alanı: Ekranın yarısı kadar bir alanda efekt başlasın
          const effectRange = window.innerWidth / 1.5;
          const normDist = gsap.utils.clamp(0, 1, dist / effectRange);

          // Efekt Değerleri
          // Merkezde (normDist 0): Scale 1.1, Y 0, Opacity 1
          // Kenarda (normDist 1): Scale 0.8, Y 150, Opacity 0.3
          const scale = gsap.utils.interpolate(1.1, 0.75, normDist); 
          const yPos = gsap.utils.interpolate(0, 200, normDist);
          const opacity = gsap.utils.interpolate(1, 0.2, normDist); 
          const rotate = (cardCenter - centerPoint) * 0.03; 

          gsap.set(card, {
            scale: scale,
            y: yPos,
            opacity: opacity,
            rotation: rotate,
            zIndex: 100 - Math.round(normDist * 100),
            filter: `blur(${normDist * 8}px)`, // Kenarda daha flu
          });
        });
      };

      gsap.ticker.add(updateCards);

      return () => {
        gsap.ticker.remove(updateCards);
      };
    },
    { scope: container }
  );

  return (
    <section
      id="services"
      ref={container}
      className="min-h-screen bg-black overflow-hidden relative flex flex-col justify-center"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-50" />
      
      {/* Devasa Arkaplan Yazısı */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="font-syne font-bold text-[15vw] leading-none text-white opacity-[0.03] select-none tracking-widest">
          {title || 'SERVICES'}
        </h1>
      </div>

      {/* Carousel Wrapper */}
      {/* 'flex items-center' ile kartları hizalıyoruz. 
          Başlangıç pozisyonunu GSAP 'set' ile yöneteceğiz, bu yüzden CSS ile ötelemeye gerek yok.
          Sadece container yüksekliğini ve dikey hizalamayı koruyoruz. */}
      <div className="w-full h-full absolute inset-0 flex items-center z-10">
        <div ref={wrapper} className="flex gap-12 md:gap-24 px-10 items-center">
          {mergedServices.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              // Kart boyutlarını ve temel stilini belirliyoruz.
              className="relative w-[300px] h-[420px] md:w-[400px] md:h-[560px] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 group will-change-transform"
            >
              {/* Kart İçeriği */}
              <div className="absolute inset-0 flex flex-col h-full">
                
                {/* Üst Kısım: Gradient & İkon */}
                <div className="h-[60%] w-full bg-gradient-to-b from-blue-200/10 to-black flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[50px] rounded-full" />
                  
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-white/80 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={service.icon} />
                  </svg>
                </div>

                {/* Alt Kısım: Detaylar */}
                <div className="h-[40%] w-full bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-start pt-6 px-6 text-center border-t border-white/5">
                  <h3 className="font-syne font-bold text-2xl md:text-3xl text-white mb-2 tracking-wide">
                    {service.titleEn}
                  </h3>
                  <p className="font-cormorant italic text-lg text-white/50">
                    {service.title}
                  </p>
                  
                  <div className="mt-6 w-12 h-[1px] bg-white/20 group-hover:w-24 group-hover:bg-blue-400 transition-all duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.2em] uppercase animate-pulse">
        Scroll to Explore
      </div>
    </section>
  );
};

export default Services;