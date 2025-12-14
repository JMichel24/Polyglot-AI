// Using built-in fetch

async function testChat() {
    try {
        // 1. Login to get token
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', await loginRes.text());
            return;
        }

        const { token } = await loginRes.json();
        console.log('Got token:', token ? 'Yes' : 'No');

        // 2. Send Chat Message
        const chatRes = await fetch('http://localhost:3000/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: 'Hello, this is a test.',
                language: 'English',
                level: 'Basic',
                history: [],
                inputMethod: 'text'
            })
        });

        if (!chatRes.ok) {
            console.error('Chat failed:', await chatRes.text());
        } else {
            const data = await chatRes.json();
            console.log('Chat success! Response:', data);
        }

    } catch (error) {
        console.error('Test error:', error);
    }
}

testChat();
