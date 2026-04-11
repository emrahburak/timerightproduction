'use client';

import React, { useState, useCallback } from 'react';
import { reelItems } from '@/data/reel';
import { getVideoUrl, getThumbnailImageUrl } from '@/lib/constants';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface ReelShowcaseProps {
  messages: {
    title: string;
    play: string;
    items: { title: string }[];
  };
}

export default function ReelShowcase({ messages }: ReelShowcaseProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const currentVideo = reelItems[currentVideoIndex];

  const handleVideoSelect = useCallback((index: number) => {
    setCurrentVideoIndex(index);
    setVideoError(false);
    setShouldAutoPlay(true);
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
      id="reelshowcase"
      className="relative w-full h-full bg-black flex flex-col justify-center items-center py-8 md:py-12"
      data-section="reelshowcase"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">

        {/* Main Video Player Stage */}
        <div className="w-full">
          {videoError ? (
            <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden shadow-2xl shadow-white/10 flex flex-col items-center justify-center text-center text-white/60">
              <p className="text-lg md:text-xl font-syne mb-2">Video loading unavailable</p>
              <p className="text-sm md:text-base">Content will be available soon</p>
            </div>
          ) : (
            <VideoPlayer
              src={getVideoUrl(currentVideo.videoUrl)}
              srcWebm={getVideoUrl(currentVideo.videoUrlWebm)}
              poster={getThumbnailImageUrl(currentVideo.thumbnail)}
              autoPlay={shouldAutoPlay}
              onError={handleVideoError}
            />
          )}
        </div>

        {/* Thumbnail Grid - 3x3, no scroll */}
        <div className="w-full grid grid-cols-3 md:grid-cols-9 gap-2">
          {reelItems.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleVideoSelect(index)}
              className={`relative w-full aspect-video rounded-md overflow-hidden border-2 transition-all duration-300 bg-neutral-900 ${index === currentVideoIndex && !videoError
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
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.75 19.5V4.5l10.5 7.5-10.5 7.5z" /></svg>
                </div>
              )}
              {index === currentVideoIndex && !videoError && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
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
