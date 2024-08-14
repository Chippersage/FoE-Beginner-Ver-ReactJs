import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ isPlaying, audioSrc, isMuted }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleCanPlay = () => {
      if (isPlaying) {
        audioElement.play().catch(error => console.error("Error playing audio:", error));
      }
    };

    if (audioElement) {
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.load();
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('canplay', handleCanPlay);
      }
    };
  }, [audioSrc, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <audio ref={audioRef} src={audioSrc} />
  );
};

export default AudioPlayer;
