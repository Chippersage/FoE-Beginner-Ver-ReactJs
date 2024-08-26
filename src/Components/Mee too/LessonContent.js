import React, { useEffect, useRef, useState } from 'react';
// import Header from '../Header/Header';
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
// import './LessonContent.css';

// const LessonContent = ({ currentLessonIndex, isPlaying, currentAudioTime }) => {
//     const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
//     const [lessonData, setLessonData] = useState([]);
//     const [audio, setAudio] = useState(new Audio());
//     // const [completedTopics, setCompletedTopics] = useState(new Set()); // Track completed topics
//     // const [showScore, setShowScore] = useState(false); // Show score animation
//     const intervalRef = useRef(null);
    

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

//             return () => clearInterval(intervalRef.current);
//         } else {
//             setHighlightedWordIndex(null);
//         }
//     }, [currentLessonIndex, isPlaying, currentAudioTime, lessonData]);

//     // Function to handle topic completion
//     // const handleCompleteTopic = () => {
//     //     if (user) {
//     //         const userId = user.uid;
//     //         const userScoreRef = doc(db, 'score', userId);
//     //         const currentScore = 2; // Points for completing a topic

//     //         getDoc(userScoreRef)
//     //             .then(docSnapshot => {
//     //                 if (docSnapshot.exists()) {
//     //                     // User's previous scores exist, update the score
//     //                     return updateDoc(userScoreRef, {
//     //                         scores: {
//     //                             topic: currentLessonIndex,
//     //                             score: currentScore, // Add 2 points for completing the topic
//     //                             timestamp: Timestamp.now()
//     //                         }
//     //                     });
//     //                 } else {
//     //                     // No previous scores, create a new document for the user
//     //                     return setDoc(userScoreRef, {
//     //                         scores: [{
//     //                             topic: currentLessonIndex,
//     //                             score: currentScore, // Add 2 points for completing the topic
//     //                             timestamp: Timestamp.now()
//     //                         }]
//     //                     });
//     //                 }
//     //             })
//     //             .catch(error => console.error("Error saving score:", error));
//     //     }
//     //     setCompletedTopics(prev => new Set(prev).add(currentLessonIndex)); // Update completed topics
//     //     setShowScore(true); // Trigger the score display animation
//     //     setTimeout(() => setShowScore(false), 3000); // Hide score display after 3 seconds
//     // };

//     // useEffect(() => {
//     //     handleCompleteTopic();
//     // }, [currentLessonIndex]);

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
//                 {/* Display score with animation
//                 {completedTopics.has(currentLessonIndex) && (
//                     <div className={`user-circle ${showScore ? "pop" : ""}`}>
//                         <img src={`${process.env.PUBLIC_URL}/audio/common/user.png`} alt="User" className="user-image" />
//                         {showScore && (
//                             <div className="score-display">
//                                 +2 Marks!
//                             </div> */}
//                         {/* )}
//                     </div> */}
//                 {/* )} */}
//             </div>
//         </div>
//     );
// };

// export default LessonContent;

// // import React, { useEffect, useRef, useState } from 'react';
// // import { useAuth } from '../Context/AuthContext';
// // import { db } from '../Firebase/FirebaseConfig';
// // import './LessonContent.css';

// // const LessonContent = ({ currentLessonIndex, isPlaying, currentAudioTime }) => {
// //     const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
// //     const [lessonData, setLessonData] = useState([]);
// //     const [audio, setAudio] = useState(new Audio());
// //     const [completedTopics, setCompletedTopics] = useState(new Set()); // Track completed topics
// //     const intervalRef = useRef(null);
// //     const { user } = useAuth(); // Authentication context

// //     // Fetch lesson data with timestamps
// //     useEffect(() => {
// //         fetch(`${process.env.PUBLIC_URL}/audio/book8/lessonsWithTimestamps.json`)
// //             .then((response) => response.json())
// //             .then((data) => {
// //                 setLessonData(data);
// //                 if (data[currentLessonIndex]) {
// //                     setAudio(new Audio(`${process.env.PUBLIC_URL}${data[currentLessonIndex].audioSrc}`));
// //                 }
// //             })
// //             .catch((error) => console.error('Error fetching lesson data:', error));
// //     }, [currentLessonIndex]);

// //     // Play the audio when the lesson changes
// //     useEffect(() => {
// //         if (audio && isPlaying) {
// //             audio.play();
// //         } else {
// //             audio.pause();
// //         }

// //         return () => {
// //             audio.pause();
// //             audio.currentTime = 0;
// //         };
// //     }, [audio, isPlaying]);

// //     // Highlight word based on current audio time
// //     useEffect(() => {
// //         if (isPlaying && lessonData.length > 0 && currentLessonIndex !== null) {
// //             const currentLesson = lessonData[currentLessonIndex];
// //             intervalRef.current = setInterval(() => {
// //                 const currentTimestampIndex = currentLesson.timestamps.findIndex(
// //                     (timestamp) => currentAudioTime >= timestamp.start && currentAudioTime <= timestamp.end
// //                 );
// //                 if (currentTimestampIndex !== -1) {
// //                     setHighlightedWordIndex(currentTimestampIndex);
// //                 }
// //             }, 100);

// //             return () => clearInterval(intervalRef.current);
// //         } else {
// //             setHighlightedWordIndex(null);
// //         }
// //     }, [currentLessonIndex, isPlaying, currentAudioTime, lessonData]);

// //     // Function to handle topic completion
// //     const handleCompleteTopic = () => {
// //         if (user) {
// //             const userId = user.uid;
// //             const userScoreRef = doc(db, 'score', userId);
// //             const currentScore = 2; // Points for completing a topic

// //             getDoc(userScoreRef)
// //                 .then(docSnapshot => {
// //                     if (docSnapshot.exists()) {
// //                         // User's previous scores exist, update the score
// //                         return updateDoc(userScoreRef, {
// //                             scores: {
// //                                 topic: currentLessonIndex,
// //                                 score: currentScore, // Add 2 points for completing the topic
// //                                 timestamp: Timestamp.now()
// //                             }
// //                         });
// //                     } else {
// //                         // No previous scores, create a new document for the user
// //                         return setDoc(userScoreRef, {
// //                             scores: [{
// //                                 topic: currentLessonIndex,
// //                                 score: currentScore, // Add 2 points for completing the topic
// //                                 timestamp: Timestamp.now()
// //                             }]
// //                         });
// //                     }
// //                 })
// //                 .catch(error => console.error("Error saving score:", error));
// //         }
// //         setCompletedTopics(prev => new Set(prev).add(currentLessonIndex)); // Update completed topics
// //     };

// //     useEffect(() => {
// //         handleCompleteTopic();
// //     }, [currentLessonIndex]);

// //     // Function to get highlighted text
// //     const getHighlightedText = (content, highlightIndex) => {
// //         return content.split(' ').map((word, index) => (
// //             <span
// //                 key={index}
// //                 className={index === highlightIndex ? 'highlighted' : ''}
// //             >
// //                 {word}{' '}
// //             </span>
// //         ));
// //     };

// //     if (lessonData.length === 0 || currentLessonIndex === null || !lessonData[currentLessonIndex]) {
// //         return <div>Loading...</div>;
// //     }

// //     const currentLesson = lessonData[currentLessonIndex];

// //     return (
// //         <div className="lesson-container">
// //             <div className="lesson-content">
// //                 <img
// //                     src={`${process.env.PUBLIC_URL}/audio/book8/${currentLesson.image}`}
// //                     alt={`Lesson ${currentLesson.id}`}
// //                     className="lesson-image"
// //                 />
// //                 <div className="text-content">
// //                     <p>{getHighlightedText(currentLesson.content, highlightedWordIndex)}</p>
// //                 </div>
// //                 {/* Slide Number */}
// //                 <div className="slide-number">
// //                     Page {currentLessonIndex + 1}
// //                 </div>
// //                 {/* Display score */}
// //                 {completedTopics.has(currentLessonIndex) && (
// //                     <div className="score-display">
// //                         +2 Marks for completing this topic!
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default LessonContent;