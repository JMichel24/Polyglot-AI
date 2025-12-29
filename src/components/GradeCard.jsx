import React, { useState, useEffect } from 'react';
import { X, Trophy, BookOpen, Gamepad2, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';
import { getGradeSummary } from '../services/gameService';
import { useAuth } from '../context/AuthContext';

export default function GradeCard({ isOpen, onClose, language, level }) {
    const [gradeSummary, setGradeSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});
    const { token } = useAuth();

    useEffect(() => {
        const fetchGrades = async () => {
            if (isOpen && token) {
                setIsLoading(true);
                try {
                    const summary = await getGradeSummary(token, language, level);
                    setGradeSummary(summary);
                } catch (error) {
                    console.error('Error fetching grades:', error);
                }
                setIsLoading(false);
            }
        };
        fetchGrades();
    }, [isOpen, token, language, level]);

    const toggleModule = (moduleName) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName]
        }));
    };

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-400';
        if (grade >= 75) return 'text-blue-400';
        if (grade >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getGradeBg = (grade) => {
        if (grade >= 90) return 'bg-green-500/20';
        if (grade >= 75) return 'bg-blue-500/20';
        if (grade >= 60) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-yellow-400" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-white">Tarjeta de Calificaciones</h2>
                            <p className="text-sm text-slate-400">{language} - Nivel {level}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : gradeSummary && gradeSummary.totalLessonsGraded > 0 ? (
                        <>
                            {/* Overall Progress */}
                            <div className="mb-6 p-4 bg-slate-700/50 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-white font-semibold">Promedio General</span>
                                    <span className={`text-3xl font-bold ${getGradeColor(gradeSummary.overallAverage)}`}>
                                        {gradeSummary.overallAverage}%
                                    </span>
                                </div>
                                <div className="h-4 bg-slate-600 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${gradeSummary.overallAverage >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'}`}
                                        style={{ width: `${Math.min(gradeSummary.overallAverage, 100)}%` }}
                                    />
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    {gradeSummary.canTakeExam ? (
                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                            <Unlock size={16} />
                                            <span>¡Examen final desbloqueado!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                                            <Lock size={16} />
                                            <span>Necesitas 75% para el examen ({75 - gradeSummary.overallAverage}% más)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Grades */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Calificaciones por Módulo</h3>

                                {Object.entries(gradeSummary.moduleGrades).map(([moduleName, module]) => (
                                    <div key={moduleName} className="bg-slate-700/30 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(moduleName)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BookOpen size={18} className="text-blue-400" />
                                                <span className="text-white font-medium">{moduleName}</span>
                                                <span className="text-xs text-slate-400">({module.lessons.length} clases)</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold ${getGradeColor(module.average)}`}>
                                                    {module.average}%
                                                </span>
                                                {expandedModules[moduleName] ? (
                                                    <ChevronUp size={18} className="text-slate-400" />
                                                ) : (
                                                    <ChevronDown size={18} className="text-slate-400" />
                                                )}
                                            </div>
                                        </button>

                                        {expandedModules[moduleName] && (
                                            <div className="px-4 pb-4 space-y-2">
                                                {module.lessons.map(lesson => (
                                                    <div key={lesson.lessonId} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                                        <span className="text-sm text-slate-300">{lesson.lessonId}</span>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {lesson.aiGrade > 0 && (
                                                                <div className="flex items-center gap-1">
                                                                    <BookOpen size={14} className="text-purple-400" />
                                                                    <span className={getGradeColor(lesson.aiGrade)}>{lesson.aiGrade}%</span>
                                                                </div>
                                                            )}
                                                            {lesson.gameGrade > 0 && (
                                                                <div className="flex items-center gap-1">
                                                                    <Gamepad2 size={14} className="text-green-400" />
                                                                    <span className={getGradeColor(lesson.gameGrade)}>{lesson.gameGrade}%</span>
                                                                </div>
                                                            )}
                                                            <div className={`px-2 py-1 rounded ${getGradeBg(lesson.combinedGrade)}`}>
                                                                <span className={`font-bold ${getGradeColor(lesson.combinedGrade)}`}>
                                                                    {lesson.combinedGrade}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <Trophy size={48} className="text-slate-600 mb-4" />
                            <p className="text-slate-400">No hay calificaciones aún</p>
                            <p className="text-sm text-slate-500">Completa clases y juegos para ver tu progreso</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>📚 IA: Calificación por clase</span>
                        <span>🎮 Juegos: Puntuación por práctica</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
