
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import ActivityPage from './components/ActivityPage';
import AudioPlayer from './components/AudioPlayer';
import Header from './components/Header';
import LessonContent from './components/LessonContent';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('lesson');
  const audioRef = useRef(null);

  const audioFiles = useMemo(() => [
    'section1.mp3', 'section2.mp3', 'section3.mp3', 'section4.mp3',
    'section5.mp3', 'section6.mp3', 'section7.mp3', 'section8.mp3',
    'section9.mp3', 'section10.mp3', 'section11.mp3', 'section12.mp3',
    'section13.mp3'
  ], []);

  useEffect(() => {
    setAudioSrc(`${process.env.PUBLIC_URL}/audio/${audioFiles[currentAudioIndex]}`);
  }, [currentAudioIndex, audioFiles]);

  const handleStart = () => setIsPlaying(true);

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
    setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + audioFiles.length) % audioFiles.length);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleMute = () => setIsMuted((prevIsMuted) => !prevIsMuted); // Toggle mute/unmute

  const handleHome = () => {
    setIsPlaying(false);
    setCurrentAudioIndex(0);
    setCurrentView('lesson');
  };

  const handleActivity = () => setCurrentView('activity');

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

  return (
    <div className="app">
      <Header />
      {currentView === 'lesson' ? (
        <>
          <LessonContent currentLessonIndex={currentAudioIndex} isPlaying={isPlaying} />
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

            {/* Toggle Pause/Play button */}
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

            {/* Toggle Mute/Unmute button */}
            <button onClick={handleMute}>
              <img
                src={
                  isMuted
                    ? `${process.env.PUBLIC_URL}/audio/common/volume-mute.png`
                    : `${process.env.PUBLIC_URL}/audio/common/volume.png`
                }
                alt={isMuted ? "Unmute" : "Mute"}
              />
            </button>

            <button onClick={handleActivity}>
              <img src={`${process.env.PUBLIC_URL}/audio/common/activity1.png`} alt="Activity" />
            </button>
          </div>
          <AudioPlayer isPlaying={isPlaying} audioSrc={audioSrc} isMuted={isMuted} />
          {/* Activity button */}
          {currentAudioIndex === audioFiles.length - 1 && (
            <button
              onClick={handleActivity}
              className="ui-btn ui-corner-all actionbuttons"
              id="activity"
              title="Go to the activities"
              style={{ width: '5em', lineHeight: '4.5em', float: 'right', marginRight: '2em' }}
            >
              {/* ACTIVITY */}
            </button>
          )}
        </>
      ) : (
        <ActivityPage />
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
