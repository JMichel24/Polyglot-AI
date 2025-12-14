import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import PlacementTest from './PlacementTest';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function OnboardingFlow({ onComplete }) {
    const [step, setStep] = useState('languages'); // languages, method, test
    const [nativeLanguage, setNativeLanguage] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('');

    const handleLanguageSelection = () => {
        setStep('method');
    };

    const handleMethodSelection = (method) => {
        if (method === 'scratch') {
            onComplete(targetLanguage, 'A1', nativeLanguage);
        } else {
            setStep('test');
        }
    };

    const handleTestComplete = (level) => {
        onComplete(targetLanguage, level, nativeLanguage);
    };

    if (step === 'languages') {
        return (
            <LanguageSelector
                nativeLanguage={nativeLanguage}
                setNativeLanguage={setNativeLanguage}
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
                onNext={handleLanguageSelection}
            />
        );
    }

    if (step === 'test') {
        return (
            <PlacementTest
                targetLanguage={targetLanguage}
                onComplete={handleTestComplete}
            />
        );
    }

    // Method Selection Step
    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">How would you like to start?</h2>
                <p className="text-slate-400">Choose the best path for your learning journey</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => handleMethodSelection('scratch')}
                    className="w-full p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all group text-left"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <BookOpen size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Start from Scratch</h3>
                            <p className="text-slate-400 text-sm">Perfect for absolute beginners. We'll start with the basics.</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleMethodSelection('test')}
                    className="w-full p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500 hover:bg-slate-750 transition-all group text-left"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                            <GraduationCap size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-1">Take a Placement Test</h3>
                            <p className="text-slate-400 text-sm">Already know some basics? Let's find your perfect starting point.</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
