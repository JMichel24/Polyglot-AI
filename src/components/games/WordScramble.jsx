import React, { useState, useEffect } from 'react';
import { Shuffle, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function WordScramble({ words, language, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambledLetters, setScrambledLetters] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [isFinished, setIsFinished] = useState(false);

    const currentWord = words[currentIndex];

    useEffect(() => {
        if (currentWord) {
            scrambleWord();
        }
    }, [currentIndex, currentWord]);

    const scrambleWord = () => {
        const letters = currentWord.word.split('').map((char, idx) => ({
            id: idx,
            char,
            used: false
        }));
        // Fisher-Yates shuffle
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        setScrambledLetters(letters);
        setUserAnswer([]);
        setShowResult(false);
    };

    const getLanguageCode = (lang) => {
        const codes = { 'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR', 'German': 'de-DE', 'Italian': 'it-IT', 'Japanese': 'ja-JP', 'Korean': 'ko-KR' };
        return codes[lang] || 'en-US';
    };

    const speakWord = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLanguageCode(language);
        speechSynthesis.speak(utterance);
    };

    const addLetter = (letter) => {
        if (letter.used) return;
        setScrambledLetters(prev => prev.map(l => l.id === letter.id ? { ...l, used: true } : l));
        setUserAnswer(prev => [...prev, letter]);
    };

    const removeLetter = (index) => {
        const letter = userAnswer[index];
        setScrambledLetters(prev => prev.map(l => l.id === letter.id ? { ...l, used: false } : l));
        setUserAnswer(prev => prev.filter((_, i) => i !== index));
    };

    const checkAnswer = () => {
        const answer = userAnswer.map(l => l.char).join('');
        const correct = answer.toLowerCase() === currentWord.word.toLowerCase();
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
    };

    const nextWord = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setScore({ correct: 0, incorrect: 0 });
        setIsFinished(false);
    };

    if (isFinished) {
        const percentage = Math.round((score.correct / words.length) * 100);
        return (
            <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">🔤 Word Scramble Complete!</h3>
                <div className="text-6xl font-bold mb-4" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>{percentage}%</div>
                <p className="text-slate-400 mb-6">{score.correct} correct / {words.length} words</p>
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
                <span className="text-slate-400 text-sm">Word {currentIndex + 1} of {words.length}</span>
                <span className="text-sm"><span className="text-green-400">{score.correct} ✓</span> / <span className="text-red-400">{score.incorrect} ✗</span></span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all" style={{ width: `${(currentIndex / words.length) * 100}%` }} />
            </div>

            {/* Hint */}
            <div className="text-center mb-6">
                <p className="text-slate-400 mb-2">Unscramble the word:</p>
                <p className="text-lg text-white bg-slate-700/50 px-4 py-2 rounded-lg inline-block">{currentWord.hint}</p>
                {currentWord.audio && (
                    <button onClick={() => speakWord(currentWord.word)} className="ml-2 p-2 hover:bg-slate-700 rounded-full">
                        <Volume2 size={20} className="text-blue-400" />
                    </button>
                )}
            </div>

            {/* User Answer Area */}
            <div className="flex flex-wrap justify-center gap-2 min-h-[60px] p-4 bg-slate-700/30 rounded-xl mb-4 border-2 border-dashed border-slate-600">
                {userAnswer.length === 0 ? (
                    <span className="text-slate-500">Tap letters below to form the word</span>
                ) : (
                    userAnswer.map((letter, index) => (
                        <button
                            key={`answer-${index}`}
                            onClick={() => !showResult && removeLetter(index)}
                            disabled={showResult}
                            className={`w-12 h-12 text-xl font-bold rounded-lg transition-all ${showResult
                                    ? isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-500'
                                }`}
                        >
                            {letter.char}
                        </button>
                    ))
                )}
            </div>

            {/* Scrambled Letters */}
            {!showResult && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {scrambledLetters.map((letter) => (
                        <button
                            key={letter.id}
                            onClick={() => addLetter(letter)}
                            disabled={letter.used}
                            className={`w-12 h-12 text-xl font-bold rounded-lg transition-all ${letter.used
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-slate-600 text-white hover:bg-slate-500 hover:scale-110'
                                }`}
                        >
                            {letter.char}
                        </button>
                    ))}
                </div>
            )}

            {/* Result / Actions */}
            {showResult ? (
                <div className="space-y-4">
                    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-bold">{isCorrect ? 'Correct!' : `The word is "${currentWord.word}"`}</span>
                    </div>
                    <button onClick={nextWord} className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">
                        {currentIndex < words.length - 1 ? 'Next Word →' : 'See Results'}
                    </button>
                </div>
            ) : (
                <div className="flex gap-3">
                    <button onClick={scrambleWord} className="flex items-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600">
                        <Shuffle size={20} /> Reshuffle
                    </button>
                    <button
                        onClick={checkAnswer}
                        disabled={userAnswer.length !== currentWord.word.length}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                        Check Answer
                    </button>
                </div>
            )}
        </div>
    );
}
