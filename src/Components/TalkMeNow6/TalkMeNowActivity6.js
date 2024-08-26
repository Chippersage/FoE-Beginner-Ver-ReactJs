
import { arrayUnion, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { db } from '../Firebase/FirebaseConfig'; // Adjust the path as needed
import '../Mee too/ActivityPage.css';
import '../Mee too/MeeToo8';

const ActivityPage = () => {
    const { user } = useAuth();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [audio, setAudio] = useState(null);
    const [highlightedText, setHighlightedText] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [currentActivity, setCurrentActivity] = useState('');
    const currentDate = new Date();

    useEffect(() => {
        console.log('Fetching activity data...');
        fetch(`${process.env.PUBLIC_URL}/audio6/Activity/Activity6.json`)
            .then(response => response.json())
            .then(data => setQuestions(data.questions))
            .catch(error => console.error('Error fetching activity data:', error));
    }, []);

    useEffect(() => {
        const startDate = new Date();
        setStartTime(formatTime(startDate));
        setCurrentActivity('Activity 6');
    
        const timer = setInterval(() => {
        const now = new Date();
        setDuration(formatDuration(now - startDate));
        }, 1000);
    
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
// Function to parse the duration from MM:SS format into milliseconds
const parseDuration = (duration) => {
    const [minutes, seconds]= duration.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
};

  // Function to calculate the start time based on end time and duration
const calculateStartTime = (endTime, duration) => {
    const endDate = new Date(endTime);
    const durationMs = parseDuration(duration);
    const startDate = new Date(endDate - durationMs);
    return formatTime(startDate);
};

  // Function to format time into HH:MM:SS format
const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

    const formatDate = (date) =>{
    const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleActivityCompletion = async () => {
        const endDate = new Date();
        const endTimeFormatted = formatTime(endDate);
        const startTimeCalculated = formatTime(new Date(endDate - parseDuration(duration)));
        
        const userData = {
            passagename: 'Talk Me...Now',
            passage: 'passage6',
            correctAnswers: correctAnswerCount,
            totalQuestions: questions.length,
            startTime: startTimeCalculated,
            endTime: endTimeFormatted,
            date: formatDate(new Date),
            duration: duration,
            activity: 'Fill in the blanks',
            questionScores: selectedAnswers.map(answer => ({
            questionNumber: answer.questionNumber,
            score: answer.isCorrect ? 1 : 0
            })),
            timestamp: Timestamp.now()
        };
        console.log('User Data to be saved:', userData); // Debugging line
        
    try {
      // Assuming user.uid exists
    await db.collection('score').doc(user.uid).set(
        {
          scores: arrayUnion(userData) // Push new score data
        },
        { merge: true } // Merge with existing document
    );
    console.log('Score data saved successfully');
 // Update cumulative score
 const userCumulativeScoreDoc = db.collection('cumulative_scores').doc(user.uid);
 const userDoc = await userCumulativeScoreDoc.get();
 const currentCumulativeData = userDoc.exists ? userDoc.data() : { totalScore: 0 };

 // Calculate the new cumulative score
 const newTotalScore = currentCumulativeData.totalScore + score;

 // Update the cumulative score document
 await userCumulativeScoreDoc.set(
     {
         totalScore: newTotalScore
     },
     { merge: true } // Merge with existing document
 );
 console.log('Cumulative score data saved successfully');
} catch (error) {
 console.error('Error saving score data:', error);
}
};
    const handleAnswerSelection = (e) => {
        const selectedValue = e.target.value;
        // const selectedLabel = e.target.nextSibling.innerText;
        if (selectedAnswer !== null) {
            alert("You have already answered this question. To choose different answer, restart the quiz.");
            return;
        }

        setSelectedAnswer(selectedValue);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const currentCorrect = selectedValue === questions[currentQuestion].correctAnswer;
        setIsCorrect(currentCorrect);
        // Update the correct answer count immediately
        if (currentCorrect) {
            setCorrectAnswerCount(prevCount => prevCount + 1);
        }
        setScore(score + (currentCorrect ? 1 : 0));

        setSelectedAnswers(prev => [
            ...prev,
            {
                questionNumber: currentQuestion + 1,
                question: questions[currentQuestion].questionText,
                selectedAnswer: e.target.nextSibling.innerText,
                correctAnswer: questions[currentQuestion].options.find(
                option => option.value === questions[currentQuestion].correctAnswer
                ).label,
                isCorrect: currentCorrect,
            }
        ]);

        const feedbackAudio = new Audio(currentCorrect ? questions[currentQuestion].correctAudioSrc : questions[currentQuestion].incorrectAudioSrc);
        feedbackAudio.play();
        setAudio(feedbackAudio);
    };

    const handleNext = () => {
        if (!selectedAnswer) {
            alert('Please select an answer before proceeding to the next question.');
            return;
        }
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            setQuizCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        }
    };

    const handleMute = () => {
        setIsMuted((prevIsMuted) => {
            if (audio) {
                audio.muted = !prevIsMuted;
            }
            return !prevIsMuted;
        });
    };

    const handleHome = () => {
        window.location.href = './MeeToo8'; // Adjust the path to your home page
    };

        const handleStartQuiz = () => {
        setCurrentQuestion(0);
        setStartTime(formatDate(new Date())); // Reset start time
        setDuration(0); // Reset duration
        setScore(0); // Reset score
        setSelectedAnswers([]); // Reset selected answers
        setQuizCompleted(false); // Reset quiz completion status
        };

    const handlePlayAgain = () => {
        setScore(0);
        setSelectedAnswers([]);
        setCurrentQuestion(-1);
        setQuizCompleted(false);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Check out this quiz app — it rocks!',
                url: window.location.href,
            })
            .then(() => console.log('Successfully shared'))
            .catch(error => console.log(error.message));
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    useEffect(() => {
        if (currentQuestion >= 0 && currentQuestion < questions.length) {
            const activityAudio = new Audio(questions[currentQuestion].audioSrc);
            activityAudio.play();
            setAudio(activityAudio);
    
            const syncData = questions[currentQuestion].syncData;
            let highlightedWords = new Set();
            let currentIndex = 0;
    
            const interval = setInterval(() => {
                const currentTime = activityAudio.currentTime;
                if (currentIndex < syncData.length) {
                    const currentText = syncData[currentIndex];
                    if (
                        currentTime >= parseFloat(currentText.start) &&
                        currentTime <= parseFloat(currentText.end) &&
                        !highlightedWords.has(currentText.text)
                    ) {
                        setHighlightedText(currentText.text);
                        highlightedWords.add(currentText.text);
                        currentIndex++;
                    }
                } else {
                    setHighlightedText('');
                }
            }, 100);
    
            return () => {
                activityAudio.pause();
                activityAudio.currentTime = 0;
                clearInterval(interval);
                setHighlightedText('');
            };
        }
    }, [currentQuestion, questions]);

    const getBadge = () => {
        if (score === questions.length) {
            return <span style={{ color: 'green' }}>Excellent! You are outstanding. Keep shining!</span>;
        }
        if (score >= questions.length * 0.7) {
            return <span style={{ color: 'blue' }}>Very Good! Keep pushing the limits.</span>;
        }
        return <span style={{ color: 'orange' }}>Keep Learning! Your next result will be better.</span>;
    };

    const getIncorrectCount = () => {
        return selectedAnswers.filter(answer => !answer.isCorrect).length;
    };
    useEffect(() => {
        if (quizCompleted && user) {
            handleActivityCompletion();
        }
    },[quizCompleted,user]);
        return (
        <div className="activity-container">
        {currentQuestion === -1 ? (
        <>
        <h2>Welcome to the Quiz!</h2>
        <p>You'll be asked a series of questions. Listen carefully to the audio and choose the correct answers. Good luck!</p>
        <button onClick={handleStartQuiz} className="start-quiz-button">
        <img src="/audio/common/start.png" alt="Start Quiz" className="start-quiz-image" />
        </button>
        </>
        ) : (
        <>
        {!quizCompleted ? (
        <>
        <h2>
        {questions[currentQuestion].syncData.map((data, index) => (
        <span
        key={index}
        style={{
        backgroundColor: highlightedText === data.text ? 'yellow' : 'transparent',
        transition: 'background-color 0.1s ease',
        }}
        >
        {data.text}
        </span>
        ))}
        </h2>
        <div className="options">
        {questions[currentQuestion].options.map((option, index) => (
        <div key={index} className={`option-container ${selectedAnswer === option.value ? (isCorrect ? 'correct-answer' : 'wrong-answer') : ''}`}>
        <input
        type="radio"
        id={`option${index}`}
        name="answer"
        value={option.value}
        checked={selectedAnswer === option.value}
        onChange={handleAnswerSelection}
        className="option-input"
        />
        <label htmlFor={`option${index}`}>{option.label}</label>
        </div>
        ))}
        </div>
        {isCorrect !== null && (
        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
        {isCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
        )}
        <div className="score-footer">
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
        <button onClick={handleHome}>
        <img src={`${process.env.PUBLIC_URL}/audio/common/home.png`} alt="Home" />
        </button>
        <button onClick={handlePrevious} disabled={currentQuestion === 0}>
        <img src={`${process.env.PUBLIC_URL}/audio/common/rewind-button.png`} alt="Previous" />
        </button>
        <button onClick={handleNext}>
        <img src={`${process.env.PUBLIC_URL}/audio/common/skip.png`} alt="Next" />
        </button>
        <span className="scrorecorrectbox">✔ {score}</span>
        <span className="scrorewrongbox">✖ {getIncorrectCount()}</span>
        </div>
        </>
        ) : (
        <>
        <div className="congratulations">
        <h1>{getBadge()}</h1>
        <img src="/audio/common/cup.gif" alt="Trophy" className="trophy-image" />
        </div>
        <h5>Quiz Completed!</h5>
        <p>Your Score: {score} / {questions.length}</p>
        <h3>Your Answers:</h3>
        <ul className="answers-list">
        {selectedAnswers.map((answer, index) => (
        <li key={index} className="answer-item">
        <strong className="question-label">{answer.question}</strong><br />
        <span className={`user-answer ${answer.isCorrect ? 'correct-answer-label' : 'wrong-answer-label'}`}>
        {answer.isCorrect ? '✔' : '✖'} {answer.selectedAnswer}
        </span>
        <br />
        <span className="correct-answer-label">Correct Answer: {answer.correctAnswer}</span>
        </li>
        ))}
        </ul>
        <div className="score-footer">
        <button onClick={handlePlayAgain} className="play-again-button">
        <img src={`${process.env.PUBLIC_URL}/audio/common/rewind-button.png`} alt="Play again" />
        </button>
        <button onClick={handleShare} className="share-button">
        <img src={`${process.env.PUBLIC_URL}/audio/common/sharing.png`} alt="Share" />
        </button>
        <button onClick={handleHome} className="home-button">
        Home Page
        </button>
        </div>

        </>
        )}
        </>
        )}
        </div>
        );
        };

        export default ActivityPage;