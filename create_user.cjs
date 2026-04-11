const { initializeDatabase } = require('./server/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        const db = await initializeDatabase();
        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.run(
            'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)',
            ['Test Agent', 'testagent@example.com', 'testagent', hashedPassword]
        );
        console.log('User testagent created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestUser();
