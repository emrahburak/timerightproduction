import React from 'react';

interface MobileServiceCardProps {
  service: {
    id: number;
    title: string;
    titleEn: string;
    icon: string;
  };
}

export default function MobileServiceCard({
  service,
}: MobileServiceCardProps) {
  return (
    <div
      className="w-full flex items-center gap-4
                 px-4 py-4 rounded-2xl
                 bg-white/5 backdrop-blur-md
                 border border-white/10
                 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Sol: İkon alanı */}
      <div
        className="flex-shrink-0 w-14 h-14
                   rounded-xl
                   bg-gradient-to-br
                   from-[#B0CCBB]/30 to-[#9AB1CA]/30
                   border border-white/10
                   flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-white/80"
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
          className="font-syne font-bold text-base
                     text-white leading-tight
                     truncate"
        >
          {service.titleEn}
        </h3>
        <p
          className="font-cormorant italic text-sm
                     text-white/50 mt-0.5 leading-snug
                     line-clamp-2"
        >
          {service.title}
        </p>
      </div>
    </div>
  );
}
