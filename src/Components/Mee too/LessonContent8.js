import React, { useEffect, useRef, useState } from 'react';
// import Header from '../Header/Header';
import '../../../src/Styles/LessonContent.css';

const LessonContent = ({ currentLessonIndex, isPlaying, currentAudioTime }) => {
    const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
    const [lessonData, setLessonData] = useState([]);
    const intervalRef = useRef(null);

    // Fetch lesson data with timestamps
    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/audio/book8/lessonsWithTimestamps.json`)
            .then((response) => response.json())
            .then((data) => setLessonData(data))
            .catch((error) => console.error('Error fetching lesson data:', error));
    }, []);

    // Highlight word based on current audio time
    useEffect(() => {
        if (isPlaying && lessonData.length > 0 && currentLessonIndex !== null) {
            const currentLesson = lessonData[currentLessonIndex];
            intervalRef.current = setInterval(() => {
                const currentTimestampIndex = currentLesson.timestamps.findIndex(
                    (timestamp) => currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
                );
                if (currentTimestampIndex !== -1) {
                    setHighlightedWordIndex(currentTimestampIndex);
                }
            }, 100);

            return () => clearInterval(intervalRef.current);
        } else {
            setHighlightedWordIndex(null);
        }
    }, [currentLessonIndex, isPlaying, currentAudioTime, lessonData]);

    // Function to get highlighted text
    const getHighlightedText = (content, highlightIndex) => {
        return content.split(' ').map((word, index) => (
            <span
                key={index}
                className={index === highlightIndex ? 'highlighted' : ''}
            >
                {word}{' '}
            </span>
        ));
    };

    if (lessonData.length === 0 || currentLessonIndex === null || !lessonData[currentLessonIndex]) {
        return <div>Loading...</div>;
    }

    const currentLesson = lessonData[currentLessonIndex];

    return (
        <div className="lesson-container">
            {/* <Header/> */}
            <div className="lesson-content">
                <img
                    src={`${process.env.PUBLIC_URL}/audio/book8/${currentLesson.image}`}
                    alt={`Lesson ${currentLesson.id}`}
                    className="lesson-image"
                />
                <div className="text-content">
                    <p>{getHighlightedText(currentLesson.content, highlightedWordIndex)}</p>
                </div>
                {/* Slide Number */}
                <div className="slide-number">
                    Page {currentLessonIndex + 1}
                </div>
            </div>
        </div>
    );
};

export default LessonContent;



// import React, { useEffect, useRef, useState } from 'react';
// import AudioPlayer from './AudioPlayer'; // Assuming you have an AudioPlayer component
// import './LessonContent.css';
// import MeeTooActivity8 from './MeeTooActivity8';

// const LessonContent = ({ currentLessonIndex, isPlaying: propIsPlaying, currentAudioTime }) => {
//     const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
//     const [lessonData, setLessonData] = useState([]);
//     const intervalRef = useRef(null);
//     const [isPlaying, setIsPlaying] = useState(propIsPlaying);
//     const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
//     const [audioSrc, setAudioSrc] = useState('');
//     const [isMuted, setIsMuted] = useState(false);
//     const [currentView, setCurrentView] = useState('lesson');
//     const audioRef = useRef(null);

//     // Fetch lesson data with timestamps
//     useEffect(() => {
//         fetch(`${process.env.PUBLIC_URL}/audio/book8/lessonsWithTimestamps.json`)
//             .then((response) => response.json())
//             .then((data) => setLessonData(data))
//             .catch((error) => console.error('Error fetching lesson data:', error));
//     }, []);

//     // Highlight word based on current audio time
//     useEffect(() => {
//         if (isPlaying && lessonData.length > 0 && currentLessonIndex !== null) {
//             const currentLesson = lessonData[currentLessonIndex];
//             intervalRef.current = setInterval(() => {
//                 const currentTimestampIndex = currentLesson.timestamps.findIndex(
//                     (timestamp) => currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
//                 );
//                 if (currentTimestampIndex !== -1) {
//                     setHighlightedWordIndex(currentTimestampIndex);
//                 }
//             }, 100);

//             return () => clearInterval(intervalRef.current);
//         } else {
//             setHighlightedWordIndex(null);
//         }
//     }, [currentLessonIndex, isPlaying, currentAudioTime, lessonData]);

//     // Function to get highlighted text
//     const getHighlightedText = (content, highlightIndex) => {
//         return content.split(' ').map((word, index) => (
//             <span
//                 key={index}
//                 className={index === highlightIndex ? 'highlighted' : ''}
//             >
//                 {word}{' '}
//             </span>
//         ));
//     };

//     // Control button handlers
//     const handleStart = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying((prevIsPlaying) => !prevIsPlaying);
//     const handleRepeat = () => {
//         setIsPlaying(false);
//         setTimeout(() => setIsPlaying(true), 100);
//     };
//     const handleNext = () => {
//         setIsPlaying(false);
//         setCurrentAudioIndex((prevIndex) => {
//             const nextIndex = (prevIndex + 1) % lessonData.length;
//             if (nextIndex === 0) {
//                 setCurrentView('activity');
//             }
//             return nextIndex;
//         });
//         setTimeout(() => setIsPlaying(true), 100);
//     };
//     const handlePrev = () => {
//         setIsPlaying(false);
//         setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + lessonData.length) % lessonData.length);
//         setTimeout(() => setIsPlaying(true), 100);
//     };
//     const handleMute = () => setIsMuted((prevIsMuted) => !prevIsMuted);
//     const handleHome = () => {
//         setIsPlaying(false);
//         setCurrentAudioIndex(0);
//         setCurrentView('lesson');
//     };
//     const handleActivity = () => setCurrentView('activity');

//     if (lessonData.length === 0 || currentLessonIndex === null || !lessonData[currentLessonIndex]) {
//         return <div>Loading...</div>;
//     }

//     const currentLesson = lessonData[currentLessonIndex];

//     return (
//         <div className="lesson-container">
//             {currentView === 'lesson' ? (
//                 <>
//                     <div className="lesson-content">
//                         <img
//                             src={`${process.env.PUBLIC_URL}/audio/book8/${currentLesson.image}`}
//                             alt={`Lesson ${currentLesson.id}`}
//                             className="lesson-image"
//                         />
//                         <div className="text-content">
//                             <p>{getHighlightedText(currentLesson.content, highlightedWordIndex)}</p>
//                         </div>
//                         <div className="slide-number">
//                             Page {currentLessonIndex + 1}
//                         </div>
//                     </div>
//                     <div className="controls">
//                         <button onClick={handleHome}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/home.png`} alt="Home" />
//                         </button>
//                         <button onClick={handlePrev}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/rewind-button.png`} alt="Previous" />
//                         </button>
//                         <button onClick={handleStart} disabled={isPlaying}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/start-button.png`} alt="Start" />
//                         </button>
//                         <button onClick={handlePause}>
//                             <img
//                                 src={isPlaying ? `${process.env.PUBLIC_URL}/audio/common/pause.png` : `${process.env.PUBLIC_URL}/audio/common/video.png`}
//                                 alt={isPlaying ? "Pause" : "Play"}
//                             />
//                         </button>
//                         <button onClick={handleRepeat}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/repeat.png`} alt="Repeat" />
//                         </button>
//                         <button onClick={handleNext}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/skip.png`} alt="Next" />
//                         </button>
//                         <button onClick={handleMute}>
//                             <img
//                                 src={isMuted ? `${process.env.PUBLIC_URL}/audio/common/volume-mute.png` : `${process.env.PUBLIC_URL}/audio/common/volume.png`}
//                                 alt={isMuted ? "Unmute" : "Mute"}
//                             />
//                         </button>
//                         <button onClick={handleActivity}>
//                             <img src={`${process.env.PUBLIC_URL}/audio/common/activity1.png`} alt="Activity" />
//                         </button>
//                     </div>
//                     <AudioPlayer isPlaying={isPlaying} audioSrc={audioSrc} isMuted={isMuted} ref={audioRef} />
//                 </>
//             ) : (
//                 <MeeTooActivity8 />
//             )}
//             <footer className="footer-container">
//                 <span className="footer-text">
//                     <b>&copy; 2015-16, Chipper Sage Education Pvt. Ltd. All rights reserved.</b>
//                     <br />
//                     <a href="https://www.thechippersage.com" target="_blank" rel="noopener noreferrer" className="footer-link">
//                         www.thechippersage.com
//                     </a>
//                 </span>
//             </footer>
//         </div>
//     );
// };

// export default LessonContent;



//     const [audio, setAudio] = useState(new Audio());
//     // const [completedTopics, setCompletedTopics] = useState(new Set()); // Track completed topics

    

//     // Fetch lesson data with timestamps
//     useEffect(() => {
//         fetch(`${process.env.PUBLIC_URL}/audio/book8/lessonsWithTimestamps.json`)
//             .then((response) => response.json())
//             .then((data) => {
//                 setLessonData(data);
//                 if (data[currentLessonIndex]) {
//                     setAudio(new Audio(`${process.env.PUBLIC_URL}${data[currentLessonIndex].audioSrc}`));
//                 }
//             })
//             .catch((error) => console.error('Error fetching lesson data:', error));
//     }, [currentLessonIndex]);

//     // Play the audio when the lesson changes
//     useEffect(() => {
//         if (audio && isPlaying) {
//             audio.play();
//         } else {
//             audio.pause();
//         }

//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, [audio, isPlaying]);

//     // Highlight word based on current audio time
//     useEffect(() => {
//         if (isPlaying && lessonData.length > 0 && currentLessonIndex !== null) {
//             const currentLesson = lessonData[currentLessonIndex];
//             intervalRef.current = setInterval(() => {
//                 const currentTimestampIndex = currentLesson.timestamps.findIndex(
//                     (timestamp) => currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
//                 );
//                 if (currentTimestampIndex !== -1) {
//                     setHighlightedWordIndex(currentTimestampIndex);
//                 }
//             }, 100);