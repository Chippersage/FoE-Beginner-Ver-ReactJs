// LessonControls.js
import React from 'react';
import './LessonControls.css';

const LessonControls = ({ onStart, onPause, onRepeat, onNext, onPrev, onMute, isPlaying, isMuted, onHome, onActivity, currentAudioIndex }) => {
  return (
    <div className="lesson-controls">
      <button onClick={onHome}>Home</button>
      <button onClick={onPrev}>Previous</button>
      <button onClick={onStart} disabled={isPlaying}>Start</button>
      <button onClick={onPause} disabled={!isPlaying}>Pause</button>
      <button onClick={onRepeat} disabled={!isPlaying}>Repeat</button>
      <button onClick={onNext}>Next</button>
      <button onClick={onMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
      {currentAudioIndex === 12 && (
        <button onClick={onActivity}>Activity</button>
      )}
    </div>
  );
};

export default LessonControls;
