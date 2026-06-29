const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { initializeDatabase } = require('./database');
const multer = require('multer');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("=== CONTROL DE ENTORNO ===");
console.log("¿GEMINI_API_KEY cargada correctamente?:", process.env.GEMINI_API_KEY ? "SÍ" : "NO");
console.log("==========================");

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

app.post('/auth/register', async (req, res) => {
    const { name, email, username, password, emailConsent } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const db = await initializeDatabase();

        // Check if email already exists
        const existingEmail = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if username already exists
        const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            'INSERT INTO users (name, email, username, password, email_consent) VALUES (?, ?, ?, ?, ?)',
            [name || null, email, username, hashedPassword, emailConsent ? 1 : 0]
        );
        res.status(201).json({ id: result.lastID, username, email });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: `Error registering user: ${error.message}` });
    }
});

app.post('/auth/login', async (req, res) => {
    console.log("=== INTENTO DE LOGIN ===", req.body);
    const { username, password } = req.body;
    console.log(`[AUTH] Login attempt for user: ${username}`);
    try {
        const db = await initializeDatabase();
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) {
            console.warn(`[AUTH] User not found: ${username}`);
            console.error("=== ERROR EN LOGIN ===", new Error(`User not found: ${username}`));
            return res.status(400).send('Cannot find user');
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username, plan: user.plan || 'free' }, JWT_SECRET);
            console.log(`[AUTH] Login successful for: ${username}`);
            res.json({ token, username: user.username, plan: user.plan || 'free' });
        } else {
            console.warn(`[AUTH] Invalid password for: ${username}`);
            console.error("=== ERROR EN LOGIN ===", new Error('Invalid password'));
            res.status(403).send('Not Allowed');
        }
    } catch (error) {
        console.error("=== ERROR EN LOGIN ===", error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/auth/me', authenticateToken, async (req, res) => {
    console.log("=== VERIFICANDO TOKEN /AUTH/ME ===");
    try {
        const db = await initializeDatabase();
        const user = await db.get('SELECT id, name, email, username, plan, created_at, native_language, target_language, level FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            console.error("=== ERROR EN /AUTH/ME ===", new Error('User not found'));
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("=== ERROR EN /AUTH/ME ===", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user preferences
app.post('/auth/preferences', authenticateToken, async (req, res) => {
    const { nativeLanguage, targetLanguage, level } = req.body;
    try {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE users SET native_language = ?, target_language = ?, level = ? WHERE id = ?`,
            [nativeLanguage, targetLanguage, level, req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Support /api/users/preferences route
app.put('/api/users/preferences', authenticateToken, async (req, res) => {
    const { nativeLanguage, targetLanguage, level } = req.body;
    try {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE users SET native_language = ?, target_language = ?, level = ? WHERE id = ?`,
            [nativeLanguage, targetLanguage, level, req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/auth/upgrade', authenticateToken, async (req, res) => {
    try {
        const db = await initializeDatabase();
        await db.run('UPDATE users SET plan = ? WHERE id = ?', ['premium', req.user.id]);
        res.json({ success: true, plan: 'premium' });
    } catch (error) {
        console.error("Error in /auth/upgrade:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/auth/downgrade', authenticateToken, async (req, res) => {
    try {
        const db = await initializeDatabase();
        await db.run('UPDATE users SET plan = ? WHERE id = ?', ['free', req.user.id]);
        res.json({ success: true, plan: 'free' });
    } catch (error) {
        console.error("Error in /auth/downgrade:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const checkPlanLimits = async (req, res, next) => {
    try {
        const db = await initializeDatabase();
        const user = await db.get('SELECT plan FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.plan === 'free') {
            const usage = await db.get(
                `SELECT COUNT(*) as count FROM messages 
                 WHERE user_id = ? AND role = 'user' 
                 AND timestamp >= datetime('now', '-24 hours')`,
                [req.user.id]
            );

            const count = usage ? usage.count : 0;
            if (count >= 20) {
                return res.status(402).json({ 
                    error: 'AI daily limit reached. Upgrade to Premium for unlimited chats!' 
                });
            }
        }
        next();
    } catch (error) {
        console.error("Error in checkPlanLimits middleware:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- CHAT ROUTES ---

const CURRICULUM = require('./curriculum');

// --- Language Mix by Level ---
// Returns instructions for how much native vs target language the AI should use
const getLanguageMixInstructions = (level, nativeLanguage, targetLanguage) => {
    const native = nativeLanguage || 'English';

    const levelInstructions = {
        'A1': {
            nativePercent: 95,
            targetPercent: 5,
            instructions: `
                **LANGUAGE MIX (A1 - Beginner)**:
                - Use **${native}** for 95% of your response (ALL explanations, instructions, feedback).
                - Use **${targetLanguage}** for only 5% (isolated vocabulary words, simple greetings).
                - ALWAYS provide pronunciation guides and translations immediately.
                - The student is just starting. Be extremely supportive and use their native language almost exclusively.
                - Example: "The word for 'hello' is <target>안녕하세요</target> (an-nyeong-ha-se-yo). Try saying it!"
            `
        },
        'A2': {
            nativePercent: 70,
            targetPercent: 30,
            instructions: `
                **LANGUAGE MIX (A2 - Elementary)**:
                - Use **${native}** for 70% of your response (explanations, complex instructions).
                - Use **${targetLanguage}** for 30% (short phrases, common expressions, simple questions).
                - Start introducing simple sentences in ${targetLanguage}, but always follow with ${native} explanation if needed.
                - Example: "<target>오늘 날씨가 좋아요</target> (The weather is nice today). Can you tell me about your day using this pattern?"
            `
        },
        'B1': {
            nativePercent: 50,
            targetPercent: 50,
            instructions: `
                **LANGUAGE MIX (B1 - Intermediate)**:
                - Use a balanced 50/50 mix of **${native}** and **${targetLanguage}**.
                - Conduct simple conversations primarily in ${targetLanguage}.
                - Use ${native} for grammar explanations and when introducing new complex concepts.
                - Challenge the student to respond in ${targetLanguage}, but offer support in ${native} when they struggle.
                - Example: Start with "<target>오늘 뭐 했어요?</target>" then explain in ${native} if they don't understand.
            `
        },
        'B2': {
            nativePercent: 30,
            targetPercent: 70,
            instructions: `
                **LANGUAGE MIX (B2 - Upper Intermediate)**:
                - Use **${targetLanguage}** for 70% of your response (main conversation, most instructions).
                - Use **${native}** for 30% (nuanced grammar points, cultural explanations, complex corrections).
                - Expect and encourage responses in ${targetLanguage}.
                - Only switch to ${native} for detailed explanations of subtle differences.
            `
        },
        'C1': {
            nativePercent: 10,
            targetPercent: 90,
            instructions: `
                **LANGUAGE MIX (C1 - Advanced)**:
                - Use **${targetLanguage}** for 90% of your response.
                - Use **${native}** only for 10% (highly technical grammar terms, rare exceptions).
                - Conduct the entire lesson/conversation in ${targetLanguage}.
                - The student should be able to understand complex explanations in ${targetLanguage}.
                - Treat $native} as a last resort for clarification only.
            `
        },
        'C2': {
            nativePercent: 0,
            targetPercent: 100,
            instructions: `
                **LANGUAGE MIX (C2 - Mastery / Full Immersion)**:
                - Use **${targetLanguage}** for 100% of your response.
                - NEVER use ${native}. This is full immersion mode.
                - Discuss abstract topics, literature, politics, philosophy—all in ${targetLanguage}.
                - Correct mistakes in ${targetLanguage} using ${targetLanguage} explanations.
                - Treat the student as a near-native speaker.
            `
        }
    };

    // Default to A1 if level not found
    return levelInstructions[level]?.instructions || levelInstructions['A1'].instructions;
};

// --- Lesson Routes ---

// Get lessons for a language/level with user progress
app.get('/lessons', authenticateToken, async (req, res) => {
    const { language, level } = req.query;
    console.log(`[API] Fetching lessons for: ${language} (${level})`);

    // Get static curriculum
    const lessons = CURRICULUM[language]?.[level] || [];
    console.log(`[API] Found ${lessons.length} lessons in curriculum`);

    try {
        const db = await initializeDatabase();
        // Get user progress
        const progress = await db.all(
            'SELECT lesson_id, status FROM lesson_progress WHERE user_id = ?',
            [req.user.id]
        );

        // Merge progress
        const lessonsWithProgress = lessons.map(lesson => {
            const p = progress.find(p => p.lesson_id === lesson.id);
            return {
                ...lesson,
                status: p ? p.status : 'available' // Default to available
            };
        });

        res.json(lessonsWithProgress);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).send("Error fetching lessons");
    }
});

// Mark lesson as complete
app.post('/lessons/complete', authenticateToken, async (req, res) => {
    const { lessonId } = req.body;

    try {
        const db = await initializeDatabase();
        await db.run(
            `INSERT INTO lesson_progress (user_id, lesson_id, status) 
             VALUES (?, ?, 'completed') 
             ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'completed'`,
            [req.user.id, lessonId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error("Error completing lesson:", error);
        res.status(500).send("Error completing lesson");
    }
});

// --- GAME SCORE ROUTES ---

// Save game score
app.post('/games/score', authenticateToken, async (req, res) => {
    const { lessonId, gameType, correct, total } = req.body;
    const userId = req.user.id;
    const percentage = Math.round((correct / total) * 100);

    try {
        const db = await initializeDatabase();

        // Save the game score
        await db.run(
            `INSERT INTO game_scores (user_id, lesson_id, game_type, score_correct, score_total, percentage) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, lessonId, gameType, correct, total, percentage]
        );

        // Extract language and level from lessonId (e.g., 'eng-a1-5' -> 'English', 'A1')
        const parts = lessonId.split('-');
        if (parts.length >= 2) {
            const langCode = parts[0];
            const levelCode = parts[1].toUpperCase();

            // Map language codes to full names
            const langMap = {
                'eng': 'English', 'spa': 'Spanish', 'fra': 'French',
                'deu': 'German', 'ita': 'Italian', 'jpn': 'Japanese', 'kor': 'Korean'
            };
            const language = langMap[langCode] || langCode;

            // Calculate average percentage for this level
            const stats = await db.get(
                `SELECT COUNT(*) as total_games, AVG(percentage) as avg_percentage 
                 FROM game_scores 
                 WHERE user_id = ? AND lesson_id LIKE ?`,
                [userId, `${langCode}-${parts[1]}-%`]
            );

            const avgPercentage = Math.round(stats.avg_percentage || 0);
            const canTakeExam = avgPercentage >= 75 ? 1 : 0;

            // Update level progress
            await db.run(
                `INSERT INTO level_progress (user_id, language, level, total_games_played, average_percentage, can_take_exam) 
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON CONFLICT(user_id, language, level) 
                 DO UPDATE SET total_games_played = ?, average_percentage = ?, can_take_exam = ?, updated_at = CURRENT_TIMESTAMP`,
                [userId, language, levelCode, stats.total_games, avgPercentage, canTakeExam,
                    stats.total_games, avgPercentage, canTakeExam]
            );
        }

        res.json({ success: true, percentage });
    } catch (error) {
        console.error("Error saving game score:", error);
        res.status(500).json({ error: "Error saving game score" });
    }
});

// Get level progress (for exam blocking)
app.get('/games/progress/:language/:level', authenticateToken, async (req, res) => {
    const { language, level } = req.params;
    const userId = req.user.id;

    try {
        const db = await initializeDatabase();

        // Get level progress
        const progress = await db.get(
            `SELECT * FROM level_progress WHERE user_id = ? AND language = ? AND level = ?`,
            [userId, language, level.toUpperCase()]
        );

        if (!progress) {
            return res.json({
                totalGamesPlayed: 0,
                averagePercentage: 0,
                canTakeExam: false,
                lessonsToRepeat: []
            });
        }

        // Find lessons with low scores (< 70%)
        const langCodeMap = {
            'English': 'eng', 'Spanish': 'spa', 'French': 'fra',
            'German': 'deu', 'Italian': 'ita', 'Japanese': 'jpn', 'Korean': 'kor'
        };
        const langCode = langCodeMap[language] || language.substring(0, 3).toLowerCase();

        const lowScoreLessons = await db.all(
            `SELECT lesson_id, AVG(percentage) as avg_score 
             FROM game_scores 
             WHERE user_id = ? AND lesson_id LIKE ? 
             GROUP BY lesson_id 
             HAVING avg_score < 70
             ORDER BY avg_score ASC`,
            [userId, `${langCode}-${level.toLowerCase()}-%`]
        );

        res.json({
            totalGamesPlayed: progress.total_games_played,
            averagePercentage: progress.average_percentage,
            canTakeExam: progress.can_take_exam === 1,
            lessonsToRepeat: lowScoreLessons.map(l => ({
                lessonId: l.lesson_id,
                score: Math.round(l.avg_score)
            }))
        });
    } catch (error) {
        console.error("Error getting level progress:", error);
        res.status(500).json({ error: "Error getting level progress" });
    }
});

// Get scores for a specific lesson
app.get('/games/lesson-scores/:lessonId', authenticateToken, async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user.id;

    try {
        const db = await initializeDatabase();
        const scores = await db.all(
            `SELECT game_type, score_correct, score_total, percentage, completed_at 
             FROM game_scores 
             WHERE user_id = ? AND lesson_id = ? 
             ORDER BY completed_at DESC 
             LIMIT 10`,
            [userId, lessonId]
        );

        res.json(scores);
    } catch (error) {
        console.error("Error getting lesson scores:", error);
        res.status(500).json({ error: "Error getting lesson scores" });
    }
});

// --- GRADE ROUTES ---

// Save lesson grade (from AI or combined)
app.post('/grades/lesson', authenticateToken, async (req, res) => {
    const { lessonId, moduleName, aiGrade, gameGrade } = req.body;
    const userId = req.user.id;

    // Calculate combined grade (average of AI and game if both exist)
    let combinedGrade = 0;
    if (aiGrade && gameGrade) {
        combinedGrade = Math.round((aiGrade + gameGrade) / 2);
    } else if (aiGrade) {
        combinedGrade = aiGrade;
    } else if (gameGrade) {
        combinedGrade = gameGrade;
    }

    try {
        const db = await initializeDatabase();

        // Insert or update the lesson grade
        await db.run(
            `INSERT INTO lesson_grades (user_id, lesson_id, module_name, ai_grade, game_grade, combined_grade)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, lesson_id) DO UPDATE SET 
                ai_grade = CASE WHEN ? > 0 THEN ? ELSE ai_grade END,
                game_grade = CASE WHEN ? > 0 THEN ? ELSE game_grade END,
                combined_grade = CASE 
                    WHEN ? > 0 AND game_grade > 0 THEN ROUND((? + game_grade) / 2)
                    WHEN ai_grade > 0 AND ? > 0 THEN ROUND((ai_grade + ?) / 2)
                    WHEN ? > 0 THEN ?
                    WHEN ? > 0 THEN ?
                    ELSE combined_grade
                END,
                completed_at = CURRENT_TIMESTAMP`,
            [userId, lessonId, moduleName, aiGrade || 0, gameGrade || 0, combinedGrade,
                aiGrade || 0, aiGrade || 0,
                gameGrade || 0, gameGrade || 0,
                aiGrade || 0, aiGrade || 0,
                gameGrade || 0, gameGrade || 0,
                aiGrade || 0, aiGrade || 0,
                gameGrade || 0, gameGrade || 0]
        );

        // Update level progress
        await updateLevelProgress(db, userId, lessonId);

        res.json({ success: true, combinedGrade });
    } catch (error) {
        console.error("Error saving lesson grade:", error);
        res.status(500).json({ error: "Error saving lesson grade" });
    }
});

// Get grade summary for a language/level
app.get('/grades/summary/:language/:level', authenticateToken, async (req, res) => {
    const { language, level } = req.params;
    const userId = req.user.id;

    try {
        const db = await initializeDatabase();

        // Map language code
        const langCodeMap = {
            'English': 'eng', 'Spanish': 'spa', 'French': 'fra',
            'German': 'deu', 'Italian': 'ita', 'Japanese': 'jpn', 'Korean': 'kor'
        };
        const langCode = langCodeMap[language] || language.substring(0, 3).toLowerCase();
        const lessonPattern = `${langCode}-${level.toLowerCase()}-%`;

        // Get all lesson grades for this level
        const grades = await db.all(
            `SELECT lesson_id, module_name, ai_grade, game_grade, combined_grade, completed_at 
             FROM lesson_grades 
             WHERE user_id = ? AND lesson_id LIKE ?
             ORDER BY lesson_id`,
            [userId, lessonPattern]
        );

        // Group by module and calculate averages
        const moduleGrades = {};
        for (const grade of grades) {
            const moduleName = grade.module_name || 'General';
            if (!moduleGrades[moduleName]) {
                moduleGrades[moduleName] = {
                    lessons: [],
                    average: 0
                };
            }
            moduleGrades[moduleName].lessons.push({
                lessonId: grade.lesson_id,
                aiGrade: grade.ai_grade,
                gameGrade: grade.game_grade,
                combinedGrade: grade.combined_grade
            });
        }

        // Calculate module averages
        let totalSum = 0;
        let totalCount = 0;
        for (const moduleName in moduleGrades) {
            const module = moduleGrades[moduleName];
            const validGrades = module.lessons.filter(l => l.combinedGrade > 0);
            if (validGrades.length > 0) {
                module.average = Math.round(
                    validGrades.reduce((sum, l) => sum + l.combinedGrade, 0) / validGrades.length
                );
                totalSum += module.average;
                totalCount++;
            }
        }

        const overallAverage = totalCount > 0 ? Math.round(totalSum / totalCount) : 0;
        const canTakeExam = overallAverage >= 75;

        res.json({
            moduleGrades,
            overallAverage,
            canTakeExam,
            totalLessonsGraded: grades.length
        });
    } catch (error) {
        console.error("Error getting grade summary:", error);
        res.status(500).json({ error: "Error getting grade summary" });
    }
});

// Helper function to update level progress
async function updateLevelProgress(db, userId, lessonId) {
    const parts = lessonId.split('-');
    if (parts.length < 2) return;

    const langCode = parts[0];
    const levelCode = parts[1].toUpperCase();
    const lessonPattern = `${langCode}-${parts[1]}-%`;

    // Map language codes to full names
    const langMap = {
        'eng': 'English', 'spa': 'Spanish', 'fra': 'French',
        'deu': 'German', 'ita': 'Italian', 'jpn': 'Japanese', 'kor': 'Korean'
    };
    const language = langMap[langCode] || langCode;

    // Calculate overall average from lesson grades
    const stats = await db.get(
        `SELECT AVG(combined_grade) as avg_grade, COUNT(*) as total 
         FROM lesson_grades 
         WHERE user_id = ? AND lesson_id LIKE ? AND combined_grade > 0`,
        [userId, lessonPattern]
    );

    const avgPercentage = Math.round(stats.avg_grade || 0);
    const canTakeExam = avgPercentage >= 75 ? 1 : 0;

    await db.run(
        `INSERT INTO level_progress (user_id, language, level, average_percentage, can_take_exam)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, language, level) DO UPDATE SET 
            average_percentage = ?, can_take_exam = ?, updated_at = CURRENT_TIMESTAMP`,
        [userId, language, levelCode, avgPercentage, canTakeExam, avgPercentage, canTakeExam]
    );
}

// --- CHAT ROUTES ---

app.get('/chat/history', authenticateToken, async (req, res) => {
    const { lessonId } = req.query;
    try {
        const db = await initializeDatabase();
        let query = 'SELECT * FROM messages WHERE user_id = ?';
        const params = [req.user.id];

        if (lessonId) {
            query += ' AND lesson_id = ?';
            params.push(lessonId);
        } else {
            query += ' AND (lesson_id IS NULL OR lesson_id = \'practice-free\')';
        }

        query += ' ORDER BY timestamp ASC';

        const messages = await db.all(query, params);
        res.json(messages);
    } catch (error) {
        res.status(500).send('Error retrieving history');
    }
});

app.post('/chat/message', authenticateToken, checkPlanLimits, upload.single('audio'), async (req, res) => {
    const { message, language, nativeLanguage, level, history: historyStr, lessonContext: lessonContextStr, inputMethod, username } = req.body;
    const userId = req.user.id;
    const audioFile = req.file;
    const studentName = username || 'Student'; // Default to 'Student' if no username

    // Parse JSON strings if sent via FormData
    let history = [];
    let lessonContext = null;
    try {
        if (historyStr) history = JSON.parse(historyStr);
        if (lessonContextStr) lessonContext = JSON.parse(lessonContextStr);
    } catch (e) {
        console.error("Error parsing JSON fields:", e);
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server missing Gemini API Key" });
    }

    try {
        const db = await initializeDatabase();
        const lessonId = lessonContext ? lessonContext.id : 'practice-free';

        // 1. Save User Message
        await db.run(
            'INSERT INTO messages (user_id, lesson_id, role, content) VALUES (?, ?, ?, ?)',
            [userId, lessonId, 'user', message || (audioFile ? '🎤 [Voice Message]' : '')]
        );

        // --- BUILD SYSTEM INSTRUCTION ---
        let systemInstruction = '';

        // Get dynamic language mix instructions based on level
        const languageMixInstructions = getLanguageMixInstructions(level, nativeLanguage, language);

        // GLOBAL PRONUNCIATION INSTRUCTION
        const pronunciationInstruction = `
            **PRONUNCIATION, MEANING & USAGE RULES**:
            1. **Target Language Tags**: ALWAYS wrap words, phrases, or sentences in the Target Language (${language}) with \`<target>\` tags.
               - Example: "The word for hello is <target>안녕하세요</target>."
               - Example: "<target>Hola</target> means Hello."
            
            2. **Phonetic Guides**: ALWAYS provide Romanization or Phonetic guides for the target language in parentheses.
               - Example (Korean): "<target>안녕하세요</target> (An-nyeong-ha-se-yo)"
               - Example (Japanese): "<target>こんにちは</target> (Konnichiwa)"
               - Example (German): "<target>Guten Tag</target> (GOO-ten tahk)"
            
            3. **Meaning Explanation**: ALWAYS explain the MEANING of words/phrases. Break down compound words or characters when relevant.
               - Example (Korean): "<target>감사합니다</target> (Gam-sa-ham-ni-da) - This means 'Thank you'. The root '감사' (gamsa) means 'gratitude'."
               - Example (German): "<target>Entschuldigung</target> (ent-SHOOL-di-goong) - This means 'Excuse me' or 'Sorry'. It comes from 'Schuld' meaning 'fault'."
            
            4. **Usage Examples**: ALWAYS provide 1-2 practical examples of HOW and WHEN to use the word/phrase in real life.
               - Example: "You would use <target>안녕하세요</target> when greeting someone politely, like entering a store or meeting someone for the first time."
               - Example: "Use <target>Entschuldigung</target> to get someone's attention on the street, or to apologize if you bump into someone."
            
            5. **Cultural Context** (when relevant): If a word has cultural significance, briefly explain it.
               - Example: "In Korean culture, bowing while saying <target>안녕하세요</target> shows respect."
               - Example: "Germans use <target>Du</target> (informal 'you') with friends, but <target>Sie</target> (formal 'you') with strangers and in business."

            6. **Voice Input**: The user sent this message via ${inputMethod === 'voice' ? 'MICROPHONE (Speech-to-Text)' : 'TEXT INPUT'}.
               ${inputMethod === 'voice' ?
                `- **Evaluate Pronunciation**: The text you see is the transcription of what the user SAID.
                - **Good Pronunciation**: If the text matches the context perfectly, explicitly praise their pronunciation.
                - **Bad Pronunciation**: If the text contains phonetic errors, assume it's a pronunciation issue.
                  - CORRECT them gently in ${nativeLanguage || 'English'}.
                  - Explain the difference in sound using ${nativeLanguage || 'English'}.
                  - Ask them to try again.
                - **Silence / Unclear**: If you cannot hear anything:
                  - Say: "I didn't catch that. Could you speak a bit louder?" (in ${nativeLanguage || 'English'}).`
                : ''}
        `;

        if (lessonContext) {
            if (lessonContext.type === 'exam') {
                // EXAM MODE PROMPT
                systemInstruction = `
                    You are an expert language examiner.
                    Target Language: ${language}
                    User Proficiency Level: ${level}
                    Student Name: ${studentName}
                    Exam Topic: "${lessonContext.topic}"

                    Your goal is to ASSESS the user's proficiency.
                    **IMPORTANT**: Address the student by their name "${studentName}" occasionally.

                    ${languageMixInstructions}

                    Instructions:
                    1. **Role**: Act as a professional, neutral examiner.
                    2. **Process**:
                       - Ask ONE question at a time related to the topic.
                       - Wait for the user's answer.
                       - Evaluate the answer internally.
                       - If the answer is correct, say "Correct" and move to the next question.
                       - If incorrect, briefly correct them and move to the next question.
                    3. **Scoring**: Keep track of the user's performance.
                    4. **Completion**: After 5 questions, give a final score (0-100) and a brief feedback summary.
                       - Format the final score exactly like this: "$$SCORE: 85$$".
                       - If the score is >= ${lessonContext.requiredScore}, add "$$RESULT: PASS$$".
                       - If the score is < ${lessonContext.requiredScore}, add "$$RESULT: FAIL$$".
                    
                    ${pronunciationInstruction}
                `;
            } else {
                // LESSON MODE PROMPT
                systemInstruction = `
                    You are a STRICT but ENCOURAGING language teacher leading a structured lesson.
                    Target Language: ${language}
                    User Proficiency Level: ${level}
                    Student Name: ${studentName}
                    Current Lesson: "${lessonContext.title}"
                    Lesson Topic: "${lessonContext.topic}"

                    ${languageMixInstructions}

                    Your goal is to TEACH via a structured cycle of Explanation -> Voice Exercise -> Writing Exercise.
                    **IMPORTANT**: Address the student by their name "${studentName}" occasionally to make the learning experience more personal.

                    **TEACHING CYCLE (Follow this strictly)**:
                    1. **EXPLAIN**: Introduce a specific concept or phrase related to "${lessonContext.topic}". Keep it brief and clear. Give an example.
                       - Follow the LANGUAGE MIX rules above for how much ${language} vs native language to use.
                    2. **VOICE EXERCISE**: Ask the user to SPEAK.
                       - Explicitly say: "Now, press the microphone and say: [Phrase] in ${language}."
                       - Wait for their response.
                       - Evaluate their pronunciation (based on the transcript).
                    3. **WRITING EXERCISE**: Ask the user to WRITE.
                       - Explicitly say: "Now, type a sentence using [Word/Concept]."
                       - Wait for their response.
                       - Correct their grammar/spelling.
                    4. **NEXT**: Once both exercises are done for a concept, move to the next concept.

                    **RULES**:
                    - **Take Charge**: Do not ask "What do you want to do?". YOU tell the user what to do.
                    - **Ignore Chit-Chat**: If the user says "Hello", say "Hello. Let's begin." and start Step 1 immediately.
                    - **Be Specific**: Always tell the user exactly what to say or write.

                    **GAMES & PRACTICE**:
                    - After teaching 3-4 vocabulary items OR when the user has completed several exercises successfully, suggest they practice with games.
                    - Say something like: "¡Excelente progreso! 🎮 ¿Por qué no pruebas los juegos de práctica para reforzar lo aprendido? Haz clic en el botón 'Practice' arriba."
                    - At the END of a lesson section (when you've covered multiple concepts), always encourage practicing with games before moving on.
                    - If the user asks about games or practice, tell them to click the 🎮 Practice button in the header.

                    **GRADING SYSTEM (VERY IMPORTANT)**:
                    - Keep track of the student's performance throughout the lesson.
                    - Evaluate based on: pronunciation accuracy, writing correctness, comprehension, and active participation.
                    - When the user says "goodbye", "exit", "finish", "done", "terminar", "salir", or similar words indicating they want to end the lesson, you MUST provide a FINAL GRADE.
                    - Also provide a grade after teaching 5-6 concepts successfully.
                    - Format the grade EXACTLY like this: "$$LESSON_GRADE: XX$$" (where XX is 0-100).
                    - Grading scale:
                      * 90-100: Excellent - Few or no errors, active participation, great pronunciation
                      * 75-89: Good - Some minor errors but solid understanding demonstrated
                      * 60-74: Needs Practice - Multiple errors, should repeat some exercises
                      * Below 60: Repeat Lesson - Significant difficulty, encourage more practice
                    - Be fair but encouraging. Always explain WHY you gave the grade.
                    - Example: "Great work today, ${studentName}! You showed excellent understanding of greetings. $$LESSON_GRADE: 85$$"

                    Format:
                    - Use "$$CORRECTION$$:" for corrections.
                    
                    ${pronunciationInstruction}
                `;
            }
        } else {
            // FREE PRACTICE MODE PROMPT
            systemInstruction = `
                You are a casual and friendly language partner (not a school teacher). 
                Target Language: ${language}
                User Proficiency Level: ${level}
                Friend's Name: ${studentName}

                ${languageMixInstructions}

                ROLE & IDENTITY:
                1. You are a native friend chatting with the user in a messaging app. Do NOT say things like "Today we will learn", "Your lesson is", "Good job", or grade them. Just chat naturally.
                2. Keep your conversational response extremely short, fresh, and friendly (maximum 3 sentences). 

                ORGANIC CORRECTION MECHANISM:
                1. Let the user express themselves freely. Do NOT interrupt or act pedantic.
                2. If the user makes a mistake in grammar, spelling, or word choice, apply a subtle but obvious correction at the very beginning of your conversational response in a friendly and casual tone.
                   - Example: "Oh, you mean 'I want to go' instead of 'I want go'? Got it! Yes, that sounds great. Where are you planning to go?"
                3. Do NOT grade the user or give percentages.

                LEVEL ADAPTATION:
                - Use vocabulary and grammar strictly suited to the user's level (${level}).
                - Keep closing questions simple, casual, and easy to answer.

                FORMAT RULES:
                - Output your response in two parts separated by "$$CORRECTION$$:".
                - Part 1 (Conversational Response): The casual response to the user, starting with the organic correction if they made a mistake. Max 3 sentences total.
                - Part 2 (Correction Explanation): If there is a critical grammar/structural error, provide a one-line extremely brief explanation in their native language (${nativeLanguage || 'English'}). Otherwise, leave it empty.

                ${pronunciationInstruction}
            `;
        }

        // 2. Call Gemini
        const contents = [];

        // Helper to push message and ensure alternating roles
        const addMessage = (role, parts) => {
            const lastMessage = contents[contents.length - 1];
            if (lastMessage && lastMessage.role === role) {
                lastMessage.parts.push(...parts);
            } else {
                contents.push({ role, parts });
            }
        };

        // Inject system instruction as first user message
        if (systemInstruction && systemInstruction.trim()) {
            addMessage('user', [{ text: `System Instruction / Teacher Personality: ${systemInstruction}` }]);
            addMessage('model', [{ text: "Understood. I will act as the specified language teacher/examiner." }]);
        }

        // Add history mapping 'assistant' role to 'model'
        if (history && history.length > 0) {
            history.forEach(msg => {
                const apiRole = msg.role === 'assistant' ? 'model' : 'user';
                addMessage(apiRole, [{ text: msg.content }]);
            });
        }

        // Add current message and optional audio data
        const currentParts = [];
        if (message) {
            currentParts.push({ text: message });
        } else if (audioFile) {
            currentParts.push({ text: "[AUDIO MESSAGE]" });
        }

        if (audioFile) {
            const mimeType = audioFile.mimetype.split(';')[0];
            currentParts.push({
                inlineData: {
                    data: audioFile.buffer.toString('base64'),
                    mimeType: mimeType
                }
            });
        }

        if (currentParts.length > 0) {
            addMessage('user', currentParts);
        }

        // Call Gemini with retries and stable model (gemini-2.5-flash) using official SDK v1 stable version
        const callGeminiWithRetry = async (contentsArray, maxRetries = 2, delayMs = 2000) => {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const modelName = "gemini-2.5-flash";
            const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: "v1" });

            let attempts = 0;
            while (attempts <= maxRetries) {
                try {
                    console.log(`[Gemini] Attempt ${attempts + 1}/${maxRetries + 1} using model ${modelName} via SDK v1...`);
                    const result = await model.generateContent({ contents: contentsArray });
                    return result;
                } catch (error) {
                    attempts++;
                    const errorStr = error.toString() + " " + (error.message || "");
                    const isTransient = error.status === 503 || 
                                       error.status === 429 ||
                                       errorStr.includes('503') || 
                                       errorStr.includes('429') ||
                                       errorStr.includes('Service Unavailable') || 
                                       errorStr.includes('Resource has been exhausted') ||
                                       errorStr.includes('overloaded');
                    
                    if (isTransient && attempts <= maxRetries) {
                        console.warn(`[Gemini Warning] Transient error (${error.message || error.toString()}). Retrying in ${delayMs}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    } else {
                        throw error;
                    }
                }
            }
        };

        const result = await callGeminiWithRetry(contents);
        const responseText = result.response.text();

        // Parse response
        let content = responseText;
        let correction = null;
        let score = null;
        let examResult = null;

        if (lessonContext && lessonContext.type === 'exam') {
            // Parse Exam Result
            const scoreMatch = responseText.match(/\$\$SCORE:\s*(\d+)\$\$/);
            const resultMatch = responseText.match(/\$\$RESULT:\s*(PASS|FAIL)\$\$/);

            if (scoreMatch) score = parseInt(scoreMatch[1]);
            if (resultMatch) examResult = resultMatch[1];

            // Clean content for display
            content = responseText.replace(/\$\$SCORE:\s*\d+\$\$/, '').replace(/\$\$RESULT:\s*(PASS|FAIL)\$\$/, '').trim();
        } else {
            // Parse Standard Correction
            const parts = responseText.split('$$CORRECTION$$:');
            content = parts[0].trim();
            correction = parts.length > 1 ? parts[1].trim() : null;

            // Parse Lesson Grade (if present)
            const lessonGradeMatch = content.match(/\$\$LESSON_GRADE:\s*(\d+)\$\$/);
            if (lessonGradeMatch && lessonContext) {
                const aiGrade = parseInt(lessonGradeMatch[1]);
                console.log(`[Grade] AI gave grade: ${aiGrade} for lesson ${lessonContext.id}`);

                // Save the AI grade to lesson_grades table
                try {
                    await db.run(
                        `INSERT INTO lesson_grades (user_id, lesson_id, module_name, ai_grade, combined_grade)
                         VALUES (?, ?, ?, ?, ?)
                         ON CONFLICT(user_id, lesson_id) DO UPDATE SET 
                            ai_grade = ?,
                            combined_grade = CASE 
                                WHEN game_grade > 0 THEN ROUND((? + game_grade) / 2)
                                ELSE ?
                            END,
                            completed_at = CURRENT_TIMESTAMP`,
                        [userId, lessonContext.id, lessonContext.module || 'General', aiGrade, aiGrade,
                            aiGrade, aiGrade, aiGrade]
                    );

                    // Update level progress
                    await updateLevelProgress(db, userId, lessonContext.id);
                } catch (gradeError) {
                    console.error('Error saving AI grade:', gradeError);
                }

                // Clean the grade marker from content for display
                content = content.replace(/\$\$LESSON_GRADE:\s*\d+\$\$/, '').trim();

                // Add the grade to the response
                score = aiGrade;
            }
        }

        // 3. Save AI Response
        await db.run(
            'INSERT INTO messages (user_id, lesson_id, role, content, correction) VALUES (?, ?, ?, ?, ?)',
            [userId, lessonId, 'assistant', content, correction]
        );

        res.json({ content, correction, score, examResult, lessonGrade: score });

    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('error.log', JSON.stringify({ error: error.message, stack: error.stack, details: error.toString() }, null, 2));
        console.error("Gemini Error:", error);

        if (error.message.includes('429') || error.toString().includes('429')) {
            res.status(429).json({ error: "Daily AI quota exceeded. Please try again later.", details: error.message });
        } else {
            res.status(500).json({ error: error.message, details: error.toString() });
        }
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`For Android emulator, use: http://10.0.2.2:${PORT}`);
});
