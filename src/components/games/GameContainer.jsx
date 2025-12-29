import React, { useState } from 'react';
import { X, Gamepad2 } from 'lucide-react';
import FlashcardGame from './FlashcardGame';
import MatchingGame from './MatchingGame';
import FillBlankGame from './FillBlankGame';
import ListeningQuiz from './ListeningQuiz';
import WordScramble from './WordScramble';

export default function GameContainer({ exercises, language, onClose, onComplete }) {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [totalScore, setTotalScore] = useState({ correct: 0, incorrect: 0 });

    const currentExercise = exercises[currentExerciseIndex];

    const handleExerciseComplete = (score) => {
        setCompletedExercises(prev => [...prev, currentExerciseIndex]);
        setTotalScore(prev => ({
            correct: prev.correct + (score.correct || 0),
            incorrect: prev.incorrect + (score.incorrect || 0)
        }));

        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // All exercises complete
            onComplete(totalScore);
        }
    };

    const renderGame = () => {
        if (!currentExercise) return null;

        switch (currentExercise.type) {
            case 'flashcard':
                return (
                    <FlashcardGame
                        items={currentExercise.items}
                        language={language}
                        onComplete={handleExerciseComplete}
                    />
                );
            case 'matching':
                return (
                    <MatchingGame
                        pairs={currentExercise.pairs}
                        language={language}
                        onComplete={handleExerciseComplete}
                    />
                );
            case 'fillblank':
                return (
                    <FillBlankGame
                        exercises={currentExercise.sentences}
                        language={language}
                        onComplete={handleExerciseComplete}
                    />
                );
            case 'listening':
                return (
                    <ListeningQuiz
                        questions={currentExercise.questions}
                        language={language}
                        onComplete={handleExerciseComplete}
                    />
                );
            case 'scramble':
                return (
                    <WordScramble
                        words={currentExercise.words}
                        language={language}
                        onComplete={handleExerciseComplete}
                    />
                );
            default:
                return <div className="text-slate-400">Unknown exercise type: {currentExercise.type}</div>;
        }
    };

    const getGameIcon = (type) => {
        const icons = {
            flashcard: '🃏',
            matching: '🔗',
            fillblank: '✏️',
            listening: '🎧',
            scramble: '🔀'
        };
        return icons[type] || '🎮';
    };

    const getGameName = (type) => {
        const names = {
            flashcard: 'Flashcards',
            matching: 'Matching',
            fillblank: 'Fill in the Blank',
            listening: 'Listening Quiz',
            scramble: 'Word Scramble'
        };
        return names[type] || 'Game';
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Gamepad2 size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {getGameIcon(currentExercise?.type)} {getGameName(currentExercise?.type)}
                            </h2>
                            <p className="text-sm text-slate-400">
                                Exercise {currentExerciseIndex + 1} of {exercises.length}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Exercise Progress Dots */}
                <div className="px-4 py-3 border-b border-slate-800 flex gap-2 justify-center shrink-0">
                    {exercises.map((ex, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all ${completedExercises.includes(idx)
                                    ? 'bg-green-500'
                                    : idx === currentExerciseIndex
                                        ? 'bg-blue-500 scale-125'
                                        : 'bg-slate-600'
                                }`}
                            title={getGameName(ex.type)}
                        />
                    ))}
                </div>

                {/* Game Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {renderGame()}
                </div>
            </div>
        </div>
    );
}
