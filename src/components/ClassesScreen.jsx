import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, Lock, Trophy, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getLevelProgress } from '../services/gameService';
import GradeCard from './GradeCard';

import { API_BASE_URL } from '../config';

export default function ClassesScreen({ language, level, onStartLesson }) {
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [levelProgress, setLevelProgress] = useState(null);
    const [isGradeCardOpen, setIsGradeCardOpen] = useState(false);
    const { token } = useAuth();

    // Fetch level progress
    useEffect(() => {
        const fetchProgress = async () => {
            if (token) {
                try {
                    const progress = await getLevelProgress(token, language, level);
                    setLevelProgress(progress);
                } catch (error) {
                    console.error('Error fetching level progress:', error);
                }
            }
        };
        fetchProgress();
    }, [language, level, token]);

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

    // Check if exam should be locked based on progress
    const isExamLocked = (lesson) => {
        if (lesson.type !== 'exam') return false;
        if (!levelProgress) return true; // Lock if no progress data
        return !levelProgress.canTakeExam;
    };

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
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{language} Course</h2>
                    <p className="text-slate-400">{level} Level • {lessons.length} Lessons</p>
                </div>
                <button
                    onClick={() => setIsGradeCardOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30"
                >
                    <BarChart3 size={20} />
                    <span className="hidden sm:inline">Calificaciones</span>
                </button>
            </header>

            {/* Level Progress Card */}
            {levelProgress && levelProgress.totalGamesPlayed > 0 && (
                <div className="mb-6 p-4 bg-slate-800/80 rounded-xl border border-slate-700 max-w-3xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Trophy size={20} className={levelProgress.averagePercentage >= 75 ? 'text-yellow-400' : 'text-slate-400'} />
                            <span className="text-white font-semibold">Progreso del Nivel</span>
                        </div>
                        <span className={`text-lg font-bold ${levelProgress.averagePercentage >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {levelProgress.averagePercentage}%
                        </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div
                            className={`h-full transition-all duration-500 ${levelProgress.averagePercentage >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'}`}
                            style={{ width: `${Math.min(levelProgress.averagePercentage, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>{levelProgress.totalGamesPlayed} juegos completados</span>
                        {levelProgress.canTakeExam ? (
                            <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle size={12} /> Examen desbloqueado
                            </span>
                        ) : (
                            <span className="text-yellow-400 flex items-center gap-1">
                                <AlertTriangle size={12} /> Necesitas 75% para el examen
                            </span>
                        )}
                    </div>

                    {/* Show lessons to repeat if any */}
                    {levelProgress.lessonsToRepeat && levelProgress.lessonsToRepeat.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                            <p className="text-xs text-orange-400 mb-2">
                                📚 Lecciones recomendadas para repetir:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {levelProgress.lessonsToRepeat.slice(0, 3).map(l => (
                                    <span key={l.lessonId} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                                        {l.lessonId} ({l.score}%)
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                            {moduleLessons.map((lesson, index) => {
                                const examLocked = isExamLocked(lesson);
                                const effectiveStatus = examLocked ? 'locked' : lesson.status;

                                return (
                                    <div
                                        key={lesson.id}
                                        className={`rounded-xl p-6 border transition-all ${lesson.type === 'exam'
                                            ? examLocked
                                                ? 'bg-slate-800/50 border-slate-600 opacity-75'
                                                : 'bg-indigo-900/40 border-indigo-500/50 hover:bg-indigo-900/60'
                                            : 'bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10'
                                            } ${effectiveStatus === 'locked' ? 'opacity-60' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {lesson.type === 'exam' ? (
                                                        <span className={`text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 ${examLocked ? 'bg-slate-600' : 'bg-indigo-600'}`}>
                                                            {examLocked ? <Lock size={12} /> : <CheckCircle size={12} />} Final Exam
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
                                                    <p className={`text-xs mt-2 font-medium ${examLocked ? 'text-orange-300' : 'text-indigo-300'}`}>
                                                        {examLocked
                                                            ? `🔒 Necesitas un promedio de 75% en los juegos para desbloquear`
                                                            : 'Pass this exam to unlock the next level.'
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => !examLocked && effectiveStatus !== 'locked' && onStartLesson(lesson)}
                                                disabled={examLocked || effectiveStatus === 'locked'}
                                                className={`p-4 rounded-full transition-all ${lesson.status === 'completed'
                                                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    : examLocked || effectiveStatus === 'locked'
                                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                        : lesson.type === 'exam'
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 hover:scale-105'
                                                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30 hover:scale-105'
                                                    }`}
                                            >
                                                {lesson.status === 'completed' ? <CheckCircle size={24} /> :
                                                    examLocked || effectiveStatus === 'locked' ? <Lock size={24} /> : <Play size={24} />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>

            {/* Grade Card Modal */}
            <GradeCard
                isOpen={isGradeCardOpen}
                onClose={() => setIsGradeCardOpen(false)}
                language={language}
                level={level}
            />
        </div>
    );
}

