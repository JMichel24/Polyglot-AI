// Using built-in fetch

async function testPronunciation() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });

        const { token } = await loginRes.json();

        // 2. Send Message simulating Voice Input with error
        // "I sink so" instead of "I think so"
        const chatRes = await fetch('http://localhost:3000/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: 'I sink so',
                language: 'English',
                level: 'Basic',
                history: [],
                inputMethod: 'voice' // Simulating voice input
            })
        });

        const data = await chatRes.json();
        console.log('AI Response:', data.content);
        console.log('Correction:', data.correction);

    } catch (error) {
        console.error('Test error:', error);
    }
}

testPronunciation();
