'use client';

import React, { useRef, useState, useCallback } from 'react';
import { reelItems } from '@/data/reel';
import { getVideoUrl, getThumbnailImageUrl } from '@/lib/constants';

interface ReelShowcaseProps {
  messages: {
    title: string;
    play: string;
    items: { title: string }[];
  };
}

export default function ReelShowcase({ messages }: ReelShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const currentVideo = reelItems[currentVideoIndex];

  const handleVideoSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setVideoError(false);
    // Automatically play new video
    setTimeout(() => {
      videoRef.current?.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }, 100);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !videoRef.current.muted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, []);

  const handleVideoError = useCallback(() => {
    console.error(`Failed to load video: ${getVideoUrl(currentVideo.videoUrl)}`);
    setVideoError(true);
    const nextIndex = (currentVideoIndex + 1) % reelItems.length;
    if (nextIndex !== currentVideoIndex) {
      setCurrentVideoIndex(nextIndex);
    }
  }, [currentVideoIndex, currentVideo]);

  return (
    <section
      className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center py-16 md:py-24"
      data-section="reelshowcase"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

        {/* Main Video Player Stage */}
        <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden shadow-2xl shadow-white/10">
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/60">
              <p className="text-lg md:text-xl font-syne mb-2">Video loading unavailable</p>
              <p className="text-sm md:text-base">Content will be available soon</p>
            </div>
          ) : (
            <video
              key={currentVideo.id}
              ref={videoRef}
              className="w-full h-full object-contain"
              muted={isMuted}
              playsInline
              autoPlay={isPlaying}
              preload="auto"
              poster={getThumbnailImageUrl(currentVideo.thumbnail)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={handleVideoError}
              onClick={togglePlay}
            >
              {/* Primary: WebM format (better compression, modern browsers) */}
              <source src={getVideoUrl(currentVideo.videoUrlWebm)} type="video/webm" />
              {/* Fallback: MP4 format (universal support) */}
              <source src={getVideoUrl(currentVideo.videoUrl)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

          {/* Video Controls - Bottom Left */}
          <div className="absolute bottom-4 left-4 flex gap-3 pointer-events-auto">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.25 6.75h-1.5v10.5h1.5V6.75zm-4.5 0h-1.5v10.5h1.5V6.75z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M9.75 19.5V4.5l10.5 7.5-10.5 7.5z" /></svg>
              )}
            </button>

            <button
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 12h.01M4 12a1 1 0 011-1h2l5-5v16l-5-5H5a1 1 0 01-1-1v-4a1 1 0 011-1z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M5 12h.01M4 12a1 1 0 011-1h2l5-5v16l-5-5H5a1 1 0 01-1-1v-4a1 1 0 011-1z" /></svg>
              )}
            </button>
          </div>

          {/* Current Video Title - Bottom Right */}
          <div className="absolute bottom-4 right-4 text-right pointer-events-none">
            <p className="text-white/80 text-sm font-syne uppercase tracking-wider">Now Playing</p>
            <p className="text-white text-lg font-syne font-bold">
              {messages.items[currentVideoIndex]?.title}
            </p>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="w-full flex flex-wrap justify-center gap-3 md:gap-4 px-4">
          {reelItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleVideoSelect(index)}
              className={`relative w-24 h-14 md:w-32 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-300 bg-neutral-900 ${index === currentVideoIndex && !videoError
                  ? 'border-white scale-105 opacity-100 shadow-lg shadow-white/20'
                  : 'border-white/40 opacity-70 hover:opacity-100 hover:border-white'
                }`}
              aria-label={`Play ${messages.items[index]?.title}`}
            >
              <img
                src={getThumbnailImageUrl(item.thumbnail)}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-thumbnail.webp';
                }}
              />
              {index !== currentVideoIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9.75 19.5V4.5l10.5 7.5-10.5 7.5z" /></svg>
                </div>
              )}
              {index === currentVideoIndex && isPlaying && !videoError && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
