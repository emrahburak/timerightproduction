import React from 'react';

interface ServiceListItemProps {
  service: {
    id: number;
    title: string;
    titleEn: string;
    icon: string;
  };
}

export default function ServiceListItem({
  service,
}: ServiceListItemProps) {
  return (
    <div
      className="w-full flex items-center gap-4 md:gap-10
                 px-4 py-4 md:px-10 md:py-10 rounded-2xl md:rounded-[2.5rem]
                 bg-white/5 backdrop-blur-md
                 border border-white/10
                 shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                 hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Sol: İkon alanı */}
      <div
        className="flex-shrink-0 w-14 h-14 md:w-24 md:h-24
                   rounded-xl md:rounded-[1.5rem]
                   bg-gradient-to-br
                   from-[#B0CCBB]/30 to-[#9AB1CA]/30
                   border border-white/10
                   flex items-center justify-center
                   group-hover:scale-110 transition-transform duration-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 md:w-12 md:h-12 text-white/80"
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

      {/* Sağ: Başlık + Açıklama */}
      <div className="flex flex-col justify-center min-w-0">
        <h3
          className="font-syne font-bold text-base md:text-2xl lg:text-3xl
                     text-white leading-tight
                     truncate md:whitespace-normal"
        >
          {service.titleEn}
        </h3>
        <p
          className="font-cormorant italic text-sm md:text-lg lg:text-xl
                     text-white/50 mt-1 md:mt-3 leading-snug
                     line-clamp-2 md:line-clamp-none"
        >
          {service.title}
        </p>
      </div>
    </div>
  );
}
