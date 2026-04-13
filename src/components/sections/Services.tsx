import React from 'react';
import Image from 'next/image';
import ServiceListItem from './ServiceListItem';
import { getServiceImageUrl } from '@/lib/constants';
import { serviceImage } from '@/data/services';

// Hizmet Verileri
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
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001/0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
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

  // Merge servicesData with passed items to get localized text with icons
  const mergedServices = servicesData.map((service, index) => {
    const item = items?.[index];
    return {
      ...service,
      titleEn: item ? item.title : '',
      title: item ? item.description : '',
    };
  });

  return (
    <section
      id="services"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center py-24"
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

      <div className="container mx-auto px-6 relative z-[40]">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {mergedServices.map((service) => (
            <ServiceListItem
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.2em] uppercase animate-pulse z-[50]">
        {scrollToExplore}
      </div>
    </section>
  );
};

export default Services;
