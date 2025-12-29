import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, HelpCircle } from 'lucide-react';

export default function FillBlankGame({ exercises, language, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const currentExercise = exercises[currentIndex];

    const checkAnswer = () => {
        const correct = userAnswer.toLowerCase().trim() === currentExercise.answer.toLowerCase().trim();
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
    };

    const nextExercise = () => {
        setUserAnswer('');
        setShowResult(false);
        setShowHint(false);
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const restart = () => {
        setCurrentIndex(0);
        setUserAnswer('');
        setShowResult(false);
        setScore({ correct: 0, incorrect: 0 });
        setIsFinished(false);
        setShowHint(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !showResult && userAnswer.trim()) {
            checkAnswer();
        } else if (e.key === 'Enter' && showResult) {
            nextExercise();
        }
    };

    // Render sentence with blank
    const renderSentence = () => {
        const parts = currentExercise.sentence.split('___');
        return (
            <div className="text-xl text-white text-center leading-relaxed">
                {parts[0]}
                <span className="inline-block mx-2 px-4 py-1 bg-blue-500/20 border-b-2 border-blue-500 min-w-[100px] text-blue-400 font-bold">
                    {showResult ? currentExercise.answer : (userAnswer || '?')}
                </span>
                {parts[1]}
            </div>
        );
    };

    if (isFinished) {
        const percentage = Math.round((score.correct / exercises.length) * 100);
        return (
            <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">📝 Exercise Complete!</h3>
                <div className="text-6xl font-bold mb-4" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
                    {percentage}%
                </div>
                <p className="text-slate-400 mb-6">
                    {score.correct} correct / {exercises.length} questions
                </p>
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
                <span className="text-slate-400 text-sm">Question {currentIndex + 1} of {exercises.length}</span>
                <span className="text-sm">
                    <span className="text-green-400">{score.correct} ✓</span> / <span className="text-red-400">{score.incorrect} ✗</span>
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${(currentIndex / exercises.length) * 100}%` }} />
            </div>

            {/* Instruction */}
            <p className="text-slate-400 text-center mb-4">Fill in the blank with the correct word:</p>

            {/* Sentence */}
            <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                {renderSentence()}
            </div>

            {/* Hint */}
            {showHint && currentExercise.hint && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-yellow-400 text-sm text-center">
                    💡 Hint: {currentExercise.hint}
                </div>
            )}

            {/* Input / Result */}
            {!showResult ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your answer..."
                        className="w-full px-4 py-4 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none text-center text-lg"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        {currentExercise.hint && (
                            <button onClick={() => setShowHint(true)} className="flex items-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600">
                                <HelpCircle size={20} /> Hint
                            </button>
                        )}
                        <button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim()}
                            className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                        >
                            Check Answer
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-bold">{isCorrect ? 'Correct!' : `Incorrect. The answer is "${currentExercise.answer}"`}</span>
                    </div>
                    <button onClick={nextExercise} className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">
                        {currentIndex < exercises.length - 1 ? 'Next Question →' : 'See Results'}
                    </button>
                </div>
            )}
        </div>
    );
}
