import React from 'react';

interface ShowcaseItemProps {
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  bgColor: string;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = ({ title, subtitle, description, stat, bgColor }) => {
  return (
    <section className={`showcase-item w-full h-full flex items-center justify-center ${bgColor} overflow-hidden`}>
      <div className="container mx-auto px-10 flex flex-col items-center text-center">
        <h3 className="font-cormorant italic text-2xl md:text-3xl text-white/60 mb-4 tracking-widest">
          {subtitle}
        </h3>
        <h2 className="font-syne font-bold text-6xl md:text-[10rem] text-white leading-none uppercase mb-8">
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
        <span className="font-syne font-black text-[30vw] whitespace-nowrap leading-none">
          {title}
        </span>
      </div>
    </section>
  );
};

export default ShowcaseItem;
