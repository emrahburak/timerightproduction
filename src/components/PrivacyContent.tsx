'use client';

import React from 'react';

interface PrivacyContentProps {
  title: string;
  content: string;
  backLabel?: string;
  onBack?: () => void;
}

export default function PrivacyContent({ title, content, backLabel, onBack }: PrivacyContentProps) {
  return (
    <div className="w-full h-full bg-black text-white p-10 md:p-20 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-20">
        {onBack && (
          <button 
            onClick={onBack}
            className="mb-12 text-[10px] uppercase tracking-widest text-white/40 hover:text-[#EAB308] transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {backLabel}
          </button>
        )}
        
        <h1 className="font-syne font-black text-5xl md:text-8xl mb-12 tracking-tighter uppercase text-[#EAB308]">
          {title}
        </h1>
        
        <div 
          className="font-cormorant text-xl md:text-2xl leading-relaxed text-white/80 space-y-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <div className="mt-20 border-t border-white/10 pt-10">
           <p className="font-archivo text-xs text-white/30 uppercase tracking-widest">
             Last Updated: February 2026
           </p>
        </div>
      </div>
    </div>
  );
}
