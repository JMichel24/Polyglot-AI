// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function testLessonMode() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const { token } = await loginRes.json();
        console.log('Login successful.');

        // 2. Send Message with Lesson Context
        console.log('Starting lesson...');
        const chatRes = await fetch('http://localhost:3000/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: "Start lesson",
                language: "English",
                level: "Basic",
                history: [],
                inputMethod: "text",
                lessonContext: JSON.stringify({
                    id: "lesson-1",
                    title: "Greetings",
                    topic: "How to say hello",
                    type: "lesson"
                })
            })
        });

        if (!chatRes.ok) {
            const text = await chatRes.text();
            console.error('Error Response:', chatRes.status, text);
        } else {
            const data = await chatRes.json();
            console.log('Success:', data);
        }

    } catch (error) {
        console.error('Test error:', error);
    }
}

testLessonMode();
