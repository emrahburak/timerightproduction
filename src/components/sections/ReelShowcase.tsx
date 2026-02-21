'use client';

import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { reelItems, type ReelItem } from '@/data/reel';
import { getVideoUrl } from '@/lib/constants';

interface ReelShowcaseProps {
  messages: {
    title: string;
    play: string;
    items: { title: string }[];
  };
}

export default function ReelShowcase({ messages }: ReelShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const currentVideo = reelItems[currentVideoIndex];

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title fade-in animation
      gsap.from('.reel-title', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Thumbnail grid fade-in
      gsap.from('.reel-thumbnail', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  const handleVideoSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setVideoError(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    // Auto-advance to next video
    const nextIndex = (currentVideoIndex + 1) % reelItems.length;
    setCurrentVideoIndex(nextIndex);
  }, [currentVideoIndex]);

  const handleVideoError = useCallback(() => {
    console.error(`Failed to load video: ${getVideoUrl(currentVideo.videoUrl)}`);
    setVideoError(true);
    // Try next video on error
    const nextIndex = (currentVideoIndex + 1) % reelItems.length;
    if (nextIndex !== currentVideoIndex) {
      setCurrentVideoIndex(nextIndex);
    }
  }, [currentVideoIndex, currentVideo]);

  return (
    <section
      ref={containerRef}
      className="relative top-0 left-0 w-full h-screen bg-black overflow-hidden"
      data-section="reelshowcase"
    >
      {/* Main Video Player */}
      <div className="absolute inset-0 flex items-center justify-center">
        {videoError ? (
          <div className="text-center text-white/60">
            <p className="text-lg md:text-xl font-syne mb-2">Video loading unavailable</p>
            <p className="text-sm md:text-base">Content will be available soon</p>
          </div>
        ) : (
          <video
            key={currentVideoIndex}
            ref={videoRef}
            src={getVideoUrl(currentVideo.videoUrl)}
            className="w-full h-full object-contain"
            muted={isMuted}
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={handleVideoError}
            onClick={togglePlay}
          />
        )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

      {/* Title Overlay */}
      <div className="absolute top-8 md:top-12 left-0 right-0 flex justify-center pointer-events-none reel-title">
        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-syne uppercase font-black tracking-[-0.02em] text-center px-4 drop-shadow-lg">
          {messages.title}
        </h2>
      </div>

      {/* Video Controls - Bottom Left */}
      <div className="absolute bottom-32 md:bottom-40 left-4 md:left-8 flex gap-3 pointer-events-auto">
        <button
          onClick={togglePlay}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        
        <button
          onClick={toggleMute}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      </div>

      {/* Current Video Title */}
      <div className="absolute bottom-32 md:bottom-40 right-4 md:right-8 text-right pointer-events-none">
        <p className="text-white/80 text-sm md:text-base font-syne uppercase tracking-wider">
          Now Playing
        </p>
        <p className="text-white text-lg md:text-xl font-syne font-bold tracking-[-0.01em]">
          {messages.items[currentVideoIndex]?.title}
        </p>
      </div>

      {/* Thumbnail Grid - Bottom */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-3 md:gap-5 px-4 reel-thumbnails">
        {reelItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleVideoSelect(index)}
            className={`reel-thumbnail relative w-20 h-12 md:w-32 md:h-20 rounded-sm overflow-hidden border-2 transition-all duration-300 bg-neutral-900 ${
              index === currentVideoIndex && !videoError
                ? 'border-white scale-105 opacity-100 shadow-lg shadow-white/20'
                : 'border-white/40 opacity-60 hover:opacity-90 hover:border-white/70'
            }`}
            aria-label={`Play ${messages.items[index]?.title}`}
          >
            {/* Thumbnail with video number */}
            <div className="w-full h-full flex items-center justify-center bg-neutral-950 relative">
              <span className="text-white/80 text-sm md:text-base font-syne font-bold z-10">
                {index + 1}
              </span>
              {/* Play icon overlay for non-active thumbnails */}
              {index !== currentVideoIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Active indicator overlay */}
            {index === currentVideoIndex && isPlaying && !videoError && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="flex gap-0.5 md:gap-1">
                  <div className="w-1 h-3 md:h-4 bg-white animate-pulse" />
                  <div className="w-1 h-3 md:h-4 bg-white animate-pulse delay-75" />
                  <div className="w-1 h-3 md:h-4 bg-white animate-pulse delay-150" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
