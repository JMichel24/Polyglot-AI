import { API_BASE_URL as API_URL } from '../config';

/**
 * Save a game score to the backend
 * @param {string} token - Auth token
 * @param {string} lessonId - Lesson ID (e.g., 'eng-a1-5')
 * @param {string} gameType - Type of game ('flashcard', 'matching', 'fillblank', etc.)
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 */
export async function saveGameScore(token, lessonId, gameType, correct, total) {
    try {
        const response = await fetch(`${API_URL}/games/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lessonId, gameType, correct, total })
        });
        return response.json();
    } catch (error) {
        console.error('Error saving game score:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get progress for a language level (for exam blocking)
 * @param {string} token - Auth token
 * @param {string} language - Language name (e.g., 'English')
 * @param {string} level - Level (e.g., 'A1')
 */
export async function getLevelProgress(token, language, level) {
    try {
        const response = await fetch(`${API_URL}/games/progress/${encodeURIComponent(language)}/${encodeURIComponent(level)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    } catch (error) {
        console.error('Error getting level progress:', error);
        return {
            totalGamesPlayed: 0,
            averagePercentage: 0,
            canTakeExam: false,
            lessonsToRepeat: []
        };
    }
}

/**
 * Get scores for a specific lesson
 * @param {string} token - Auth token
 * @param {string} lessonId - Lesson ID
 */
export async function getLessonScores(token, lessonId) {
    try {
        const response = await fetch(`${API_URL}/games/lesson-scores/${encodeURIComponent(lessonId)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    } catch (error) {
        console.error('Error getting lesson scores:', error);
        return [];
    }
}

/**
 * Save lesson grade (AI or game grade)
 * @param {string} token - Auth token
 * @param {string} lessonId - Lesson ID
 * @param {string} moduleName - Module name
 * @param {number} aiGrade - AI grade (0-100) or null
 * @param {number} gameGrade - Game grade (0-100) or null
 */
export async function saveLessonGrade(token, lessonId, moduleName, aiGrade, gameGrade) {
    try {
        const response = await fetch(`${API_URL}/grades/lesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lessonId, moduleName, aiGrade, gameGrade })
        });
        return response.json();
    } catch (error) {
        console.error('Error saving lesson grade:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get grade summary for a language/level
 * @param {string} token - Auth token
 * @param {string} language - Language name
 * @param {string} level - Level (A1, A2, etc.)
 */
export async function getGradeSummary(token, language, level) {
    try {
        const response = await fetch(`${API_URL}/grades/summary/${encodeURIComponent(language)}/${encodeURIComponent(level)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    } catch (error) {
        console.error('Error getting grade summary:', error);
        return {
            moduleGrades: {},
            overallAverage: 0,
            canTakeExam: false,
            totalLessonsGraded: 0
        };
    }
}

