// import React, { useEffect, useRef, useState } from 'react';
// import './LessonContent.css';

// const LessonContent = ({ currentLessonIndex, isPlaying, currentAudioTime }) => {
//     const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
//     const [lessonData, setLessonData] = useState([]);
//     const intervalRef = useRef(null);

//     useEffect(() => {
//         fetch(`${process.env.PUBLIC_URL}/audio/book8/lessonsWithTimestamps.json`)
//             .then((response) => response.json())
//             .then((data) => setLessonData(data))
//             .catch((error) => console.error('Error fetching lesson data:', error));
//     }, []);

//     useEffect(() => {
//         if (isPlaying && lessonData.length > 0 && currentLessonIndex !== null) {
//             const currentLesson = lessonData[currentLessonIndex];
//             intervalRef.current = setInterval(() => {
//                 const timestamp = currentLesson.timestamps.findIndex((timestamp) =>
//                     currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
//                 );
//                 if (timestamp !== -1) {
//                     setHighlightedWordIndex(timestamp);
//                 }
//             }, 100);

//             return () => clearInterval(intervalRef.current);
//         } else {
//             setHighlightedWordIndex(null);
//         }
//     }, [currentLessonIndex, isPlaying, currentAudioTime, lessonData]);

//     const getHighlightedText = (text, highlightIndex) => {
//         return text.split(' ').map((word, index) => (
//             <span
//                 key={index}
//                 className={index === highlightIndex ? 'highlighted' : ''}
//             >
//                 {word}{' '}
//             </span>
//         ));
//     };

//     if (lessonData.length === 0 || currentLessonIndex === null || !lessonData[currentLessonIndex]) {
//         return <div>Loading...</div>;
//     }

//     const currentLesson = lessonData[currentLessonIndex];

//     return (
//         <div className="lesson-container">
//             <div className="lesson-content">
//                 <img
//                     src={`${process.env.PUBLIC_URL}/audio/book8/${currentLesson.image}`}
//                     alt={`Lesson ${currentLesson.id}`}
//                     className="lesson-image"
//                 />
//                 <div className="text-content">
//                     <p>{getHighlightedText(currentLesson.content, highlightedWordIndex)}</p>
//                 </div>
//                 {/* Slide Number */}
//                 <div className="slide-number">
//                     Page {currentLessonIndex + 1}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LessonContent;
import React, { useEffect, useRef, useState } from 'react';
import './LessonContent.css';

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
