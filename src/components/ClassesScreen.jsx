import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { API_BASE_URL } from '../config';

export default function ClassesScreen({ language, level, onStartLesson }) {
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchLessons = async () => {
            console.log(`Fetching lessons for Language: ${language}, Level: ${level}`);
            setError(null);
            try {
                const API_URL = API_BASE_URL;
                console.log(`Attempting to fetch from: ${API_URL}/lessons`);

                const response = await fetch(`${API_URL}/lessons?language=${language}&level=${level}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Response status:", response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Lessons data received:", data);
                    setLessons(data);
                } else {
                    const errText = await response.text();
                    console.error("Failed to fetch lessons:", errText);
                    setError(`Failed to load lessons: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
                setError(`Network Error: ${error.message}. Ensure backend is running and reachable.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, [language, level, token]);

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center text-slate-400">Loading curriculum...</div>;
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20 max-w-md">
                    <h3 className="text-lg font-bold mb-2">Connection Error</h3>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-900 p-8 overflow-y-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{language} Course</h2>
                <p className="text-slate-400">{level} Level • {lessons.length} Lessons</p>
            </header>

            <div className="space-y-8 max-w-3xl">
                {lessons.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
                        <p className="text-slate-400 text-lg">No lessons found for {language} ({level}).</p>
                        <p className="text-slate-500 text-sm mt-2">Please try selecting a different level or language.</p>
                    </div>
                ) : (
                    Object.entries(lessons.reduce((acc, lesson) => {
                        const moduleName = lesson.module || 'General';
                        if (!acc[moduleName]) acc[moduleName] = [];
                        acc[moduleName].push(lesson);
                        return acc;
                    }, {})).map(([moduleName, moduleLessons]) => (
                        <div key={moduleName} className="space-y-4">
                            <h3 className="text-xl font-bold text-blue-400 pl-2 border-l-4 border-blue-500">{moduleName}</h3>
                            {moduleLessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className={`rounded-xl p-6 border transition-all ${lesson.type === 'exam'
                                        ? 'bg-indigo-900/40 border-indigo-500/50 hover:bg-indigo-900/60'
                                        : 'bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10'
                                        } ${lesson.status === 'locked' ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {lesson.type === 'exam' ? (
                                                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                                                        <CheckCircle size={12} /> Final Exam
                                                    </span>
                                                ) : (
                                                    <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                        Lesson {index + 1}
                                                    </span>
                                                )}

                                                {lesson.status === 'completed' && (
                                                    <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                                                        <CheckCircle size={14} /> {lesson.type === 'exam' ? 'Passed' : 'Completed'}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                                            <p className="text-slate-400 text-sm">{lesson.topic}</p>
                                            {lesson.type === 'exam' && (
                                                <p className="text-indigo-300 text-xs mt-2 font-medium">Pass this exam to unlock the next level.</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => lesson.status !== 'locked' && onStartLesson(lesson)}
                                            disabled={lesson.status === 'locked'}
                                            className={`p-4 rounded-full transition-all ${lesson.status === 'completed'
                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                : lesson.status === 'locked'
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    : lesson.type === 'exam'
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 hover:scale-105'
                                                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30 hover:scale-105'
                                                }`}
                                        >
                                            {lesson.status === 'completed' ? <CheckCircle size={24} /> :
                                                lesson.status === 'locked' ? <Lock size={24} /> : <Play size={24} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
