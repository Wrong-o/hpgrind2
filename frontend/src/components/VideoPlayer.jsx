import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
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
  onError,
  isDraggable = true
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const videoContent = (
    <div className={`relative ${className} cursor-move`}>
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
      {!controls && isPlaying === false && (
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
  );

  if (!isDraggable) {
    return videoContent;
  }

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      bounds="parent"
      handle=".cursor-move"
    >
      {videoContent}
    </Draggable>
  );
};
