const { initializeDatabase } = require('./server/database');

async function checkUsers() {
    try {
        const db = await initializeDatabase();
        const users = await db.all('SELECT id, username, email FROM users');
        console.log('Users found:', users);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
