import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ListeningQuiz({ questions, language, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);

    const currentQuestion = questions[currentIndex];

    const getLanguageCode = (lang) => {
        const codes = {
            'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR',
            'German': 'de-DE', 'Italian': 'it-IT', 'Japanese': 'ja-JP',
            'Korean': 'ko-KR'
        };
        return codes[lang] || 'en-US';
    };

    const playAudio = () => {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.audio);
        utterance.lang = getLanguageCode(language);
        utterance.rate = 0.8; // Slower for learners
        speechSynthesis.speak(utterance);
        setHasPlayed(true);
    };

    const checkAnswer = (answerIndex) => {
        setSelectedAnswer(answerIndex);
        const correct = answerIndex === currentQuestion.correctIndex;
        if (correct) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
        setShowResult(true);
    };

    const nextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setHasPlayed(false);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore({ correct: 0, incorrect: 0 });
        setIsFinished(false);
        setHasPlayed(false);
    };

    if (isFinished) {
        const percentage = Math.round((score.correct / questions.length) * 100);
        return (
            <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">🎧 Listening Quiz Complete!</h3>
                <div className="text-6xl font-bold mb-4" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
                    {percentage}%
                </div>
                <p className="text-slate-400 mb-6">{score.correct} correct / {questions.length} questions</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={restart} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500">
                        <RotateCcw size={20} /> Try Again
                    </button>
                    <button onClick={() => onComplete(score)} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500">
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-sm">
                    <span className="text-green-400">{score.correct} ✓</span> / <span className="text-red-400">{score.incorrect} ✗</span>
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${(currentIndex / questions.length) * 100}%` }} />
            </div>

            {/* Audio Button */}
            <div className="flex flex-col items-center justify-center mb-6">
                <p className="text-slate-400 mb-4">Listen and choose the correct answer:</p>
                <button
                    onClick={playAudio}
                    className={`p-6 rounded-full transition-all ${hasPlayed ? 'bg-purple-600/50' : 'bg-purple-600 animate-pulse'} hover:bg-purple-500`}
                >
                    <Volume2 size={48} className="text-white" />
                </button>
                <p className="text-purple-400 mt-2 text-sm">{hasPlayed ? 'Click to replay' : 'Click to listen'}</p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctIndex;

                    let buttonClass = 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600';
                    if (showResult) {
                        if (isCorrect) buttonClass = 'bg-green-500/20 text-green-400 border-green-500/50';
                        else if (isSelected) buttonClass = 'bg-red-500/20 text-red-400 border-red-500/50';
                    } else if (isSelected) {
                        buttonClass = 'bg-blue-600 text-white border-blue-500';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => !showResult && checkAnswer(index)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${buttonClass}`}
                        >
                            <span className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center text-sm font-bold">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1 text-left">{option}</span>
                            {showResult && isCorrect && <CheckCircle size={20} className="text-green-400" />}
                            {showResult && isSelected && !isCorrect && <XCircle size={20} className="text-red-400" />}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            {showResult && (
                <button onClick={nextQuestion} className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">
                    {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
            )}
        </div>
    );
}
