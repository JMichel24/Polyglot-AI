// Using built-in fetch

async function testLesson() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });

        const { token } = await loginRes.json();

        // 2. Start Lesson (Simulated)
        // User just says "Hola" in a lesson context
        const chatRes = await fetch('http://localhost:3000/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: 'Hola',
                language: 'English',
                level: 'Basic',
                history: [],
                lessonContext: {
                    title: 'Greetings',
                    topic: 'Saying Hello and Goodbye'
                },
                inputMethod: 'text'
            })
        });

        const data = await chatRes.json();
        console.log('User: Hola');
        console.log('AI Response:', data.content);

    } catch (error) {
        console.error('Test error:', error);
    }
}

testLesson();
