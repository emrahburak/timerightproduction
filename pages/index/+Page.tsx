import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Page() {
  const container = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Sürekli kendi etrafında zarif dönüş
    gsap.to(".diamond-svg", {
      rotateY: 360,
      duration: 15,
      repeat: -1,
      ease: "none",
    });

    // 2. Nabız gibi atan ışık (Glow Effect)
    gsap.to(".diamond-svg", {
      filter: "drop-shadow(0 0 45px rgba(168, 85, 247, 0.7)) brightness(1.2)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 3. Yazıların şık bir şekilde gelişi
    gsap.from(".fade-up", {
      opacity: 0,
      y: 30,
      stagger: 0.3,
      duration: 1.5,
      ease: "expo.out",
    });
  }, { scope: container });

  return (
    <div ref={container} className="h-screen w-full bg-[#0d0d0d] flex flex-col justify-center items-center overflow-hidden font-sans">

      {/* Diamond Container */}
      <div className="relative mb-12" style={{ perspective: '800px' }}>
        <div className="diamond-svg w-32 h-32 md:w-40 md:h-40">
          <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            {/* Profesyonel Brilliant Cut Elmas Vektörü */}
            <path d="M128 10L195 75L128 245L61 75L128 10Z" fill="#9333EA" />
            <path d="M128 10L195 75H61L128 10Z" fill="#C084FC" />
            <path d="M128 10L160 75L128 120L96 75L128 10Z" fill="#E9D5FF" fillOpacity="0.4" />
            <path d="M195 75L128 245L160 75H195Z" fill="#7E22CE" />
            <path d="M61 75L128 245L96 75H61Z" fill="#6B21A8" />
          </svg>
        </div>
      </div>

      {/* Text Group */}
      <div className="text-center px-4">
        <h1 className="fade-up text-white text-4xl md:text-6xl font-black tracking-[0.25em] uppercase">
          TIME RIGHT <span className="text-purple-500">PRODUCTION</span>
        </h1>
        <div className="fade-up h-[1px] w-20 bg-purple-600 mx-auto my-6 opacity-50"></div>
        <p className="fade-up text-gray-400 text-lg md:text-xl tracking-[0.5em] font-light uppercase">
          Çok Yakında
        </p>
      </div>

      {/* Ambient BG Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.08),transparent)] pointer-events-none" />
    </div>
  );
}
