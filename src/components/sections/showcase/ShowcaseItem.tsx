import React from 'react';
import Image from 'next/image';

interface ShowcaseItemProps {
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  bgColor: string;
  imageUrl?: string;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = ({ title, subtitle, description, stat, bgColor, imageUrl }) => {
  return (
    <section className={`showcase-item w-full h-full flex items-center justify-center ${bgColor} overflow-hidden relative`}>
      {/* Background Image Layer */}
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={`${title} Background`}
            fill
            className="absolute inset-0 z-0 opacity-20 object-cover"
          />
          {/* Top Fade-out Overlay */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent z-[2]" />
          
          {/* Ambience Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30 z-[1]" />
        </>
      )}

      <div className="container mx-auto px-10 flex flex-col items-center text-center relative z-10">
        <h3 className="font-cormorant italic text-2xl md:text-3xl text-white/60 mb-4 tracking-widest uppercase">
          {subtitle}
        </h3>
        <h2 className="font-syne font-bold text-6xl md:text-[8rem] lg:text-[10rem] text-white leading-none uppercase mb-8">
          {title}
        </h2>
        <p className="font-archivo text-lg md:text-xl text-white/80 max-w-2xl mb-12 tracking-wide">
          {description}
        </p>
        <div className="font-syne font-bold text-4xl md:text-6xl text-white">
          <span className="font-cormorant italic font-light text-white/40 block text-xl mb-2">RESULT</span>
          {stat}
        </div>
      </div>
      
      {/* Background large text for texture */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="font-syne font-black text-[30vw] whitespace-nowrap leading-none uppercase">
          {title}
        </span>
      </div>
    </section>
  );
};

export default ShowcaseItem;
