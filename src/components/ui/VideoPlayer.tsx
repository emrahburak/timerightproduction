'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  srcWebm?: string;
  poster?: string;
  autoPlay?: boolean;
  onError?: () => void;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
};

export default function VideoPlayer({ src, srcWebm, poster, autoPlay, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true); // Start visible
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto-hide controls logic
  const handleInteraction = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setIsVolumeOpen(false); // Close volume slider if idle
      }
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      handleInteraction();
    }
  }, [isPlaying, handleInteraction]);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (autoPlay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    }
  }, [src, autoPlay]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
      handleInteraction();
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mobile priority: If controls are hidden, first tap shows controls.
    if (!showControls) {
      handleInteraction();
    } else {
      // If controls are already shown, tap toggles play/pause.
      togglePlay();
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    // On mobile, tapping volume icon can also toggle volume slider visibility
    setIsVolumeOpen(!isVolumeOpen);
    handleInteraction();
  };

  const handleProgressChange = (val: number) => {
    handleInteraction();
    if (videoRef.current && duration) {
      const newTime = (val / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(val);
    }
  };

  const handleVolumeChange = (val: number) => {
    handleInteraction();
    const newVol = val / 100;
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const buttonClass = "text-white hover:bg-white/10 rounded-md p-2 transition-colors duration-200 flex items-center justify-center";

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm group"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
    >
      <video
        key={src}
        ref={videoRef}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onError={onError}
        playsInline
        poster={poster}
        onClick={handleVideoClick}
        muted={isMuted}
      >
        {srcWebm && (
          <source src={srcWebm} type="video/webm" />
        )}
        <source src={src} type="video/mp4" />
      </video>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()} // Prevent video click when interacting with controls
          >
            {/* Top row: progress slider */}
            <div className="flex items-center gap-3 text-xs text-white">
              <span>{formatTime(currentTime)}</span>
              <div className="relative w-full h-2 flex items-center group/slider">
                {/* Visual Track */}
                <div className="absolute w-full h-1 bg-white/20 rounded-full group-hover/slider:h-1.5 transition-all" />
                {/* Visual Progress */}
                <motion.div
                  className="absolute left-0 h-1 bg-white rounded-full pointer-events-none group-hover/slider:h-1.5 transition-all"
                  animate={{ width: `${progress || 0}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {/* Native Range Input for flawless mobile touch/drag */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress || 0}
                  onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Bottom row: controls */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className={buttonClass}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div 
                  className="flex items-center gap-2 group/volume"
                  onMouseEnter={() => setIsVolumeOpen(true)}
                  onMouseLeave={() => setIsVolumeOpen(false)}
                >
                  <button onClick={toggleMute} className={buttonClass}>
                    <VolumeIcon size={20} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 flex items-center ${isVolumeOpen ? 'w-24' : 'w-0'}`}>
                    <div className="relative w-20 h-2 flex items-center mx-2 group/volslider">
                      {/* Visual Track */}
                      <div className="absolute w-full h-1 bg-white/20 rounded-full group-hover/volslider:h-1.5 transition-all" />
                      {/* Visual Volume */}
                      <motion.div
                        className="absolute left-0 h-1 bg-white rounded-full pointer-events-none group-hover/volslider:h-1.5 transition-all"
                        animate={{ width: `${isMuted ? 0 : volume * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                      {/* Native Range Input */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={isMuted ? 0 : volume * 100}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaybackSpeed(speed);
                      handleInteraction();
                    }}
                    className={`${buttonClass} text-xs font-semibold px-2 py-1 ${playbackSpeed === speed ? "bg-white/20" : ""}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
