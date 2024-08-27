
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../../src/Styles/website.css';
import AudioPlayer from '../Mee too/AudioPlayer';
import LessonContent6 from './LessonContent6';
import TalkMeNowActivity6 from './TalkMeNowActivity6';

function App() {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('lesson');
  const audioRef = useRef(null);
  const navigate = useNavigate(); // Navigation hook

  // List of audio files
  const audioFiles = useMemo(() => [
    'section1.ogg', 'section2.ogg', 'section3.ogg', 'section4.ogg',
    'section5.ogg', 'section6.ogg', 'section7.ogg', 'section8.ogg',
    'section9.ogg', 'section10.ogg', 'section11.ogg', 'section12.ogg',
    'section13.ogg'
  ], []);

  
  useEffect(() => {
    setAudioSrc(`${process.env.PUBLIC_URL}/audio6/Lesson/${audioFiles[currentAudioIndex]}`);
  }, [currentAudioIndex, audioFiles]);

  
  const handleStart = () => {
      setIsPlaying(true);
    
  };
  const handlePause = () => setIsPlaying((prevIsPlaying) => !prevIsPlaying); // Toggle play/pause


  

  const handleRepeat = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentAudioIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % audioFiles.length;
      if (nextIndex === 0) {
        setCurrentView('activity');
      }
      return nextIndex;
    });
    setTimeout(() => setIsPlaying(true), 100);
  };


  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentAudioIndex(prevIndex => (prevIndex - 1 + audioFiles.length) % audioFiles.length);
    setTimeout(() => setIsPlaying(true), 100);
  };
  const handleMute = () => setIsMuted((prevIsMuted) => !prevIsMuted); // Toggle mute/unmute
  

  const handleHome = () => {
    setIsPlaying(false);
    setCurrentAudioIndex(0);
    setCurrentView('lesson');
  };

  const handleActivity = () => {
    setCurrentView('activity');
  
  };

  // Effect for audio playback control
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
        // Logout or redirect to a different page after inactivity
        alert('You have been logged out due to inactivity.');
        navigate('/dashboard'); // Replace with your login or logout path
      }, 600000); // 30 seconds of inactivity
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
      {/* {<Header /> } */}
      {currentView === 'lesson' ? (
        <>
          <LessonContent6 currentLessonIndex={currentAudioIndex} isPlaying={isPlaying} />
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
          { <AudioPlayer isPlaying={isPlaying} audioSrc={audioSrc} isMuted={isMuted} ref={audioRef} /> }
        </>
      ) : (
        <TalkMeNowActivity6 />
      )}
      <footer className="footer-container">
        <span className="footer-text">
          <b>&copy; 2015-16, Chipper Sage Education Pvt. Ltd. All rights reserved.</b>
          <br />
           <a href="https://www.thechippersage.com" target="_blank" rel="noopener noreferrer" className="footer-link">
             www.thechippersage.com
           </a>
          {/* <span className="footer-link">Sitemap</span>
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Use</span>
          <span className="footer-link">Contact Us</span> */}
        </span>
      </footer>
    </div>
  );
}

export default App;
