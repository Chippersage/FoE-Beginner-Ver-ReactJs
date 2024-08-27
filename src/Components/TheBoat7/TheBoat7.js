import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../src/Styles/website.css';
import AudioPlayer from '../Mee too/AudioPlayer';
import LessonContent7 from './LessonContent7';
import TheBoatActivity7 from './TheBoatActivity7';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('lesson');
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // List of audio files
  const audioFiles = useMemo(() => [
    'section1.ogg', 'section2.ogg', 'section3.ogg', 'section4.ogg',
    'section5.ogg', 'section6.ogg', 'section7.ogg', 'section8.ogg',
    'section9.ogg', 'section10.ogg', 'section11.ogg', 'section12.ogg',
    'section13.ogg', 'section14.ogg', 'section15.ogg', 'section16.ogg',
    'section17.ogg', 'section18.ogg', 'section19.ogg'
  ], []);

  useEffect(() => {
    setAudioSrc(`${process.env.PUBLIC_URL}/audio7/Lesson7/${audioFiles[currentAudioIndex]}`);
  }, [currentAudioIndex, audioFiles]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying((prevIsPlaying) => !prevIsPlaying);

  const handleRepeat = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentAudioIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= audioFiles.length) {
        setCurrentView('activity 7');
        return prevIndex;
      }
      return nextIndex;
    });
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentAudioIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleMute = () => setIsMuted((prevIsMuted) => !prevIsMuted);

  const handleHome = () => {
    setIsPlaying(false);
    setCurrentAudioIndex(0);
    setCurrentView('lesson');
  };

  const handleActivity = () => {
    setCurrentView('activity');
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc, isMuted]);

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        alert('You have been logged out due to inactivity.');
        navigate('/dashboard');
      }, 600000); // 10 minutes of inactivity
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [navigate]);

  return (
    <div className="app">
      {currentView === 'lesson' ? (
        <>
          <LessonContent7 currentLessonIndex={currentAudioIndex} isPlaying={isPlaying} />
          <div className="controls">
            <button onClick={handleHome}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/home.png`} alt="Home" />
            </button>
            <button onClick={handlePrev}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/rewind-button.png`} alt="Previous" />
            </button>
            <button onClick={handleStart} disabled={isPlaying}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/start-button.png`} alt="Start" />
            </button>
            <button onClick={handlePause}>
              <img
                src={
                  isPlaying
                    ? `${process.env.PUBLIC_URL}/audio/common/pause.png`
                    : `${process.env.PUBLIC_URL}/audio/common/video.png`
                }
                alt={isPlaying ? "Pause" : "Play"}
              />
            </button>
            <button onClick={handleRepeat}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/repeat.png`} alt="Repeat" />
            </button>
            <button onClick={handleNext}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/skip.png`} alt="Next" />
            </button>
            <button onClick={handleMute}>
              <img
                src={
                  isMuted
                    ? `${process.env.PUBLIC_URL}/audio/common/volume-mute.png`
                    : `${process.env.PUBLIC_URL}/audio/common/volume.png`}
                alt={isMuted ? "Unmute" : "Mute"}
              />
            </button>
            <button onClick={handleActivity}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/activity1.png`} alt="Activity" />
            </button>
          </div>
          <AudioPlayer isPlaying={isPlaying} audioSrc={audioSrc} isMuted={isMuted} ref={audioRef} />
        </>
      ) : (
        <TheBoatActivity7 />
      )}
      <footer className="footer-container">
        <span className="footer-text">
          <b>&copy; 2015-16, Chipper Sage Education Pvt. Ltd. All rights reserved.</b>
          <br />
          <a href="https://www.thechippersage.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            www.thechippersage.com
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
