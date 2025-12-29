import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function FlashcardGame({ items, language, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [shuffledItems, setShuffledItems] = useState([]);

    useEffect(() => {
        // Shuffle items on mount
        setShuffledItems([...items].sort(() => Math.random() - 0.5));
    }, [items]);

    const currentCard = shuffledItems[currentIndex];

    const speakWord = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLanguageCode(language);
        speechSynthesis.speak(utterance);
    };

    const getLanguageCode = (lang) => {
        const codes = {
            'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR',
            'German': 'de-DE', 'Italian': 'it-IT', 'Japanese': 'ja-JP',
            'Korean': 'ko-KR'
        };
        return codes[lang] || 'en-US';
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
        setShowAnswer(true);
    };

    const nextCard = () => {
        setShowAnswer(false);
        setIsFlipped(false);
        if (currentIndex < shuffledItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restart = () => {
        setShuffledItems([...items].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setScore({ correct: 0, incorrect: 0 });
        setIsFinished(false);
        setShowAnswer(false);
        setIsFlipped(false);
    };

    if (!currentCard && !isFinished) {
        return <div className="text-slate-400">Loading...</div>;
    }

    if (isFinished) {
        const percentage = Math.round((score.correct / shuffledItems.length) * 100);
        return (
            <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">🎉 Flashcards Complete!</h3>
                <div className="text-6xl font-bold mb-4" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
                    {percentage}%
                </div>
                <p className="text-slate-400 mb-6">
                    {score.correct} correct / {shuffledItems.length} total
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={restart}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        <RotateCcw size={20} /> Try Again
                    </button>
                    <button
                        onClick={() => onComplete(score)}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors"
                    >
                        Continue Lesson
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">
                    Card {currentIndex + 1} of {shuffledItems.length}
                </span>
                <span className="text-sm">
                    <span className="text-green-400">{score.correct} ✓</span>
                    {' / '}
                    <span className="text-red-400">{score.incorrect} ✗</span>
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${((currentIndex) / shuffledItems.length) * 100}%` }}
                />
            </div>

            {/* Flashcard */}
            <div
                className={`relative h-64 cursor-pointer perspective-1000 ${isFlipped ? 'flipped' : ''}`}
                onClick={() => !showAnswer && setIsFlipped(!isFlipped)}
            >
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 ${isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); speakWord(currentCard.word); }}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Volume2 size={24} className="text-white" />
                    </button>
                    <span className="text-4xl font-bold text-white text-center">{currentCard.word}</span>
                    <span className="text-white/60 mt-4 text-sm">Tap to flip</span>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 flex items-center justify-center transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 rotate-y-180'}`}>
                    <span className="text-3xl font-bold text-white text-center">{currentCard.translation}</span>
                </div>
            </div>

            {/* Answer Buttons */}
            {!showAnswer ? (
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => handleAnswer(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors border border-red-500/30"
                    >
                        <XCircle size={24} /> Didn't Know
                    </button>
                    <button
                        onClick={() => handleAnswer(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors border border-green-500/30"
                    >
                        <CheckCircle size={24} /> Got It!
                    </button>
                </div>
            ) : (
                <button
                    onClick={nextCard}
                    className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-bold"
                >
                    Next Card →
                </button>
            )}
        </div>
    );
}
