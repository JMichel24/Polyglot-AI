import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock } from 'lucide-react';

export default function MatchingGame({ pairs, language, onComplete }) {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        initializeGame();
    }, [pairs]);

    useEffect(() => {
        if (startTime && !isFinished) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [startTime, isFinished]);

    const initializeGame = () => {
        // Create cards from pairs - one with word, one with translation
        const allCards = [];
        pairs.forEach((pair, index) => {
            allCards.push({ id: `word-${index}`, text: pair.word, pairId: index, type: 'word' });
            allCards.push({ id: `trans-${index}`, text: pair.translation, pairId: index, type: 'translation' });
        });
        // Shuffle
        setCards(allCards.sort(() => Math.random() - 0.5));
        setSelected([]);
        setMatched([]);
        setAttempts(0);
        setIsFinished(false);
        setStartTime(Date.now());
        setElapsedTime(0);
    };

    const handleCardClick = (card) => {
        if (matched.includes(card.pairId)) return;
        if (selected.length === 2) return;
        if (selected.find(s => s.id === card.id)) return;

        const newSelected = [...selected, card];
        setSelected(newSelected);

        if (newSelected.length === 2) {
            setAttempts(prev => prev + 1);

            // Check if match
            if (newSelected[0].pairId === newSelected[1].pairId &&
                newSelected[0].type !== newSelected[1].type) {
                // Match found!
                setTimeout(() => {
                    setMatched(prev => [...prev, newSelected[0].pairId]);
                    setSelected([]);

                    // Check if game complete
                    if (matched.length + 1 === pairs.length) {
                        setIsFinished(true);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => setSelected([]), 800);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isFinished) {
        const efficiency = Math.round((pairs.length / attempts) * 100);
        return (
            <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">🎯 All Matched!</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-700/50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-blue-400">{attempts}</div>
                        <div className="text-slate-400 text-sm">Attempts</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-purple-400">{formatTime(elapsedTime)}</div>
                        <div className="text-slate-400 text-sm">Time</div>
                    </div>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={initializeGame}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500"
                    >
                        <RotateCcw size={20} /> Play Again
                    </button>
                    <button
                        onClick={() => onComplete({ attempts, time: elapsedTime })}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">Match the pairs</span>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-blue-400">Matched: {matched.length}/{pairs.length}</span>
                    <span className="flex items-center gap-1 text-purple-400">
                        <Clock size={16} /> {formatTime(elapsedTime)}
                    </span>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {cards.map(card => {
                    const isSelected = selected.find(s => s.id === card.id);
                    const isMatched = matched.includes(card.pairId);

                    return (
                        <button
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            disabled={isMatched}
                            className={`
                                aspect-square rounded-xl p-3 font-medium text-sm transition-all duration-300
                                flex items-center justify-center text-center
                                ${isMatched
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 scale-95'
                                    : isSelected
                                        ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-102'
                                }
                            `}
                        >
                            {card.text}
                        </button>
                    );
                })}
            </div>

            {/* Attempts Counter */}
            <div className="mt-4 text-center text-slate-400 text-sm">
                Attempts: {attempts}
            </div>
        </div>
    );
}
