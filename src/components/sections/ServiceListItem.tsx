"use client";

import React, { useState } from 'react';

interface ServiceListItemProps {
  service: {
    id: number;
    title: string;    // Bu aslında description (tr.json'dan geliyor)
    titleEn: string;  // Bu aslında title (tr.json'dan geliyor)
    icon: string;
  };
}

export default function ServiceListItem({
  service,
}: ServiceListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`w-full flex flex-col cursor-pointer
                 px-6 py-6 md:px-10 md:py-8 rounded-2xl md:rounded-[2rem]
                 bg-white/5 backdrop-blur-md
                 border border-white/10
                 shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                 hover:bg-white/10 transition-all duration-500 group overflow-hidden
                 ${isOpen ? 'bg-white/10 border-white/20' : ''}`}
    >
      {/* Header: İkon + Başlık + Ok */}
      <div className="flex items-center gap-6 md:gap-10 w-full">
        {/* Sol: İkon alanı */}
        <div
          className={`flex-shrink-0 w-12 h-12 md:w-20 md:h-20
                     rounded-xl md:rounded-[1.5rem]
                     bg-gradient-to-br
                     from-[#B0CCBB]/20 to-[#9AB1CA]/20
                     border border-white/10
                     flex items-center justify-center
                     transition-all duration-500
                     ${isOpen ? 'scale-110 from-[#B0CCBB]/40 to-[#9AB1CA]/40' : 'group-hover:scale-105'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-10 md:h-10 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d={service.icon}
            />
          </svg>
        </div>

        {/* Orta: Başlık */}
        <div className="flex-grow min-w-0">
          <h3
            className={`font-syne font-bold text-lg md:text-2xl lg:text-3xl
                       text-white transition-colors duration-300
                       ${isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'}`}
          >
            {service.titleEn}
          </h3>
        </div>

        {/* Sağ: Accordion İkonu */}
        <div className={`text-white/30 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content: Açıklama (Accordion) */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-6 md:mt-8' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="font-cormorant text-base md:text-xl lg:text-2xl
                       text-white/70 leading-relaxed border-t border-white/5 pt-6 md:pt-8"
          >
            {service.title}
          </p>
        </div>
      </div>
    </div>
  );
}
