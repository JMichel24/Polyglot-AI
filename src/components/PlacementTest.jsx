import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { PLACEMENT_QUESTIONS } from '../data/placementQuestions';

export default function PlacementTest({ targetLanguage, onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const questions = PLACEMENT_QUESTIONS[targetLanguage] || PLACEMENT_QUESTIONS.English;
    const question = questions[currentQuestion];

    const handleAnswer = (index) => {
        setSelectedOption(index);
        if (index === question.correct) {
            setScore(s => s + 1);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(c => c + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 500);
    };

    const getLevel = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return 'C1';
        if (percentage >= 75) return 'B2';
        if (percentage >= 60) return 'B1';
        if (percentage >= 40) return 'A2';
        return 'A1';
    };

    if (showResult) {
        const level = getLevel();
        return (
            <div className="flex flex-col h-full items-center justify-center space-y-8 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap size={48} className="text-green-400" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Test Complete!</h2>
                    <p className="text-slate-400">Based on your results, we recommend starting at:</p>
                    <div className="text-4xl font-bold text-blue-400 mt-4">{level}</div>
                    <p className="text-slate-500 text-sm mt-2">Score: {score}/{questions.length}</p>
                </div>
                <button
                    onClick={() => onComplete(level)}
                    className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8"
                >
                    Start Learning
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                {/* Score hidden during test */}
                <span>Progress: {Math.round(((currentQuestion) / questions.length) * 100)}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                <div className="flex flex-col justify-center min-h-full space-y-8 pb-6">
                    <h3 className="text-2xl font-semibold text-center">{question.question}</h3>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 rounded-xl text-left font-medium transition-all ${selectedOption !== null
                                    ? selectedOption === index
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-slate-800 border-slate-700 opacity-50'
                                    : 'bg-slate-800 border border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {selectedOption === index && (
                                        <div className="w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
