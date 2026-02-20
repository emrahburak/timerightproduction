'use client';

import React from 'react';

// Tip tanımı: Services.tsx'ten gelen 'service' objesinin yapısı
interface ServiceData {
  id: number;
  title: string;
  titleEn: string;
  icon: string;
}

interface ServiceCardProps {
  service: ServiceData;
}

// React.forwardRef kullanarak bileşeni tanımlıyoruz.
// Bu sayede Services.tsx'ten gelen 'ref'i, bu bileşenin ana div'ine iletebileceğiz.
const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(({ service }, ref) => {
  return (
    <div
      ref={ref}
      // Kart boyutlarını ve temel stilini belirliyoruz.
      className="relative w-[300px] h-[420px] md:w-[400px] md:h-[560px] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5 group will-change-transform bg-[#212121]"
    >
      {/* Kart İçeriği */}
      <div className="absolute inset-0 flex flex-col h-full">

        {/* Üst Kısım: Gradient & İkon */}
                  <div className="h-[60%] w-full bg-gradient-to-r from-[#B0CCBB] to-[#9AB1CA] flex items-center justify-center p-6 relative overflow-hidden">          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[50px] rounded-full" />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-[#272928] transition-all duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
  );
});

ServiceCard.displayName = 'ServiceCard'; // Debugging için isimlendirme

export default ServiceCard;
