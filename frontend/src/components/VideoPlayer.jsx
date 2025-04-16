import React, { useRef, useState, useEffect } from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className = '',
  onEnded,
  onError
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ensure video plays when autoPlay is true
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (autoPlay) {
      // Some browsers block autoplay unless video is muted
      videoElement.muted = true;

      // Try to play the video
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Autoplay was prevented:', error);
        });
      }
      setIsPlaying(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    const handleError = () => {
      if (onError) onError();
    };
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
    };
  }, [onEnded, onError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseDown = (e) => {
    if (e.target === videoRef.current) return; // Allow normal video controls
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Keep the video within the viewport
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={containerRef}
      className={`fixed cursor-move ${className}`}
      style={{
        top: position.y,
        left: position.x,
        zIndex: 50,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          className="w-full h-full rounded-lg"
          playsInline={true}
        />
        {!controls && !isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 cursor-pointer"
          >
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
