const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function initializeDatabase() {
    if (db) return db;

    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            username TEXT UNIQUE,
            password TEXT,
            email_consent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            lesson_id TEXT,
            role TEXT,
            content TEXT,
            correction TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS lesson_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            lesson_id TEXT,
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, lesson_id)
        );

        CREATE TABLE IF NOT EXISTS game_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            lesson_id TEXT,
            game_type TEXT,
            score_correct INTEGER,
            score_total INTEGER,
            percentage INTEGER,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS level_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            language TEXT,
            level TEXT,
            total_games_played INTEGER DEFAULT 0,
            average_percentage INTEGER DEFAULT 0,
            can_take_exam INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, language, level)
        );

        CREATE TABLE IF NOT EXISTS lesson_grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            lesson_id TEXT,
            module_name TEXT,
            ai_grade INTEGER DEFAULT 0,
            game_grade INTEGER DEFAULT 0,
            combined_grade INTEGER DEFAULT 0,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, lesson_id)
        );

        CREATE INDEX IF NOT EXISTS idx_game_scores_user_lesson ON game_scores(user_id, lesson_id);
        CREATE INDEX IF NOT EXISTS idx_level_progress_user ON level_progress(user_id, language, level);
        CREATE INDEX IF NOT EXISTS idx_lesson_grades_user ON lesson_grades(user_id, lesson_id);
    `);

    // Migration: Add new user columns if they don't exist
    const migrations = [
        'ALTER TABLE users ADD COLUMN name TEXT',
        'ALTER TABLE users ADD COLUMN email TEXT UNIQUE',
        'ALTER TABLE users ADD COLUMN email_consent INTEGER DEFAULT 0',
        'ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
    ];

    for (const sql of migrations) {
        try {
            await db.exec(sql);
        } catch (e) {
            // Column likely exists, ignore
        }
    }

    // Migration: Add lesson_id if it doesn't exist
    try {
        await db.exec('ALTER TABLE messages ADD COLUMN lesson_id TEXT');
    } catch (e) {
        // Column likely exists, ignore
    }

    console.log('Database initialized');
    return db;
}

module.exports = { initializeDatabase };
