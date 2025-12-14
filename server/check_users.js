const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function checkUsers() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    const users = await db.all('SELECT id, username FROM users');
    console.log('Existing Users:', users);
}

checkUsers().catch(console.error);
