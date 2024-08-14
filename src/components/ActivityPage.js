import React, { useEffect, useState } from 'react';
import './ActivityPage.css';

const ActivityPage = () => {
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

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/audio/ActivityPage.json`)
            .then(response => response.json())
            .then(data => setQuestions(data.questions))
            .catch(error => console.error('Error fetching activity data:', error));
    }, []);

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
        } else  {
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
    
    // const handleMute = () => setIsMuted((prevIsMuted) => !prevIsMuted);
    const handleMute = () => {
        setIsMuted((prevIsMuted) => {
            if (audio) {
                audio.muted = !prevIsMuted; // Toggle the mute state of the audio
            }
            return !prevIsMuted;
        });
    };

    const handleHome = () => {
        window.location.href = './app.js';
    };

    const handleStartQuiz = () => {
        setCurrentQuestion(0);
    };
    useEffect(() => {
        if (currentQuestion >= 0 && currentQuestion < questions.length) {
            const activityAudio = new Audio(questions[currentQuestion].audioSrc);
            activityAudio.play();
            setAudio(activityAudio);
    
            const syncData = questions[currentQuestion].syncData;
            let highlightedWords = new Set(); // Track highlighted words
            let currentIndex = 0;
    
            const interval = setInterval(() => {
                const currentTime = activityAudio.currentTime;
                if (currentIndex < syncData.length) {
                    const currentText = syncData[currentIndex];
                    if (
                        currentTime >= parseFloat(currentText.start) &&
                        currentTime <= parseFloat(currentText.end) &&
                        !highlightedWords.has(currentText.text) // Ensure the word has not been highlighted yet
                    ) {
                        setHighlightedText(currentText.text);
                        highlightedWords.add(currentText.text); // Mark the word as highlighted
                        currentIndex++; // Move to the next word in syncData
                    }
                } else {
                    setHighlightedText(''); // Clear highlighted text after all words have been processed
                }
            }, 100); // Check every 100ms
    
            return () => {
                activityAudio.pause();
                activityAudio.currentTime = 0;
                clearInterval(interval);
                setHighlightedText(''); // Clear highlighted text when the component unmounts or question changes
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
                {/* <img src={audio && audio.muted ? `${process.env.PUBLIC_URL}/audio/common/volume-mute.png` : `${process.env.PUBLIC_URL}/audio/common/volume.png`} alt="Mute/Unmute" /> */}
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
        <button onClick={handleNext} >
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
        {!answer.isCorrect && (
        <span className="correct-answer-display"><span className="correct-answer-label">{answer.correctAnswer}</span></span>
        )}
            </li>
                    ))}
                            </ul>
                            <button className="back-to-home-btn"onClick={handleHome}>Back to Home</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
export default ActivityPage;