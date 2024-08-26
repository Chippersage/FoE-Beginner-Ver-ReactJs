
import { arrayUnion, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { db } from '../Firebase/FirebaseConfig'; // Adjust the path as needed
import './ActivityPage.css';
import './website';

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
    // const [TotalnumberOfQuestion, setTotalnumberOfQuestion] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [currentActivity, setCurrentActivity] = useState('');
    //const [questionScores, setQuestionScores] = useState([]);
    const currentDate = new Date();

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/audio/ActivityPage.json`)
            .then(response => response.json())
            .then(data => setQuestions(data.questions))
            .catch(error => console.error('Error fetching activity data:', error));
    }, []);

    useEffect(() => {
        // Example logic to initialize activity and start time
        setStartTime(formatTime(currentDate));
        setCurrentActivity('Activity 1');
        //start a timer for Duration
        const timer = setInterval(() => {
            setDuration(prevDuration => prevDuration + 1);
          }, 1000);
          return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => { date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  

  const formatTime = (date) => { date.toLocaleTimeString('en-IN', { hour12: true }); // Indian time format
  

  const handleActivityCompletion = async () => {
    const userData = {
        passageName: 'Being Sick',
        passageId: 'passage1',
        correctAnswers: correctAnswerCount,
        totalQuestions: questions.length,
        startTime: startTime,
        endTime: formatTime(new Date()),
        date: formatDate(currentDate),
        duration: duration,
        activity: currentActivity,
        questionScores: selectedAnswers.map(answer => ({
            question: answer.question,
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: answer.correctAnswer,
            isCorrect: answer.isCorrect,
            score: answer.isCorrect ? 1 : 0
        })),
        timestamp: Timestamp.now()
    };

    try {
      // Assuming user.uid exists
      await db.collection('score').doc(user.uid).set(
        {
          scores: db.FieldValue.arrayUnion(userData) // Push new score data
        },
        { merge: true } // Merge with existing document
      );
      console.log('Score data saved successfully');
    } catch (error) {
      console.error('Error saving score data:', error);
    }
  };

  
    const handleAnswerSelection = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = e.target.nextSibling.innerText;

        setSelectedAnswer(selectedValue);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const currentCorrect = selectedValue === questions[currentQuestion].correctAnswer;
        setIsCorrect(currentCorrect);
        setScore(score + (currentCorrect ? 1 : 0));

        setSelectedAnswers(prev => [
            ...prev,
            {
                question: questions[currentQuestion].questionText,
                selectedAnswer: selectedLabel,
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
        window.location.href = './website'; // Adjust the path to your home page
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
    const userId = user.uid;
    const userScoreRef = doc(db, 'score', userId);

    getDoc(userScoreRef)
        .then(docSnapshot => {
            if (docSnapshot.exists()) {
                // User's previous scores exist, append the new score
                updateDoc(userScoreRef, {
                    scores: arrayUnion({
                        questionScores: selectedAnswers.map(answer => ({
                            question: answer.question,
                            score: answer.isCorrect ? 1 : 0
                        })),
                        timestamp: Timestamp.now()
                    })
                });
            } else {
                // No previous scores, create a new document for the user
                setDoc(userScoreRef, {
                    scores: [{
                        questionScores: selectedAnswers.map(answer => ({
                            question: answer.question,
                            score: answer.isCorrect ? 1 : 0
                        })),
                        timestamp: Timestamp.now()
                    }]
                });
            }
        })
        .catch(error => console.error("Error saving score:", error));
}
}, [quizCompleted, selectedAnswers, user]);

    return (
        <div className="activity-container">
            {currentQuestion === -1 ? (
                <>
                    <h2>Welcome to the Quiz!</h2>
                    <p>You'll be asked a series of questions. Listen carefully to the audio and choose the correct answers. Good luck!</p>
                    <button onClick={() => setCurrentQuestion(0)} className="start-quiz-button">
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
                                            name="quiz"
                                            value={option.value}
                                            checked={selectedAnswer === option.value}
                                            onChange={handleAnswerSelection}
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