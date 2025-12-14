const fs = require('fs');
const path = require('path');

// Create a dummy audio file if it doesn't exist
const dummyAudioPath = path.join(__dirname, 'test_audio.webm');
if (!fs.existsSync(dummyAudioPath)) {
    fs.writeFileSync(dummyAudioPath, 'dummy audio content');
}

async function testAudioUpload() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });

        const { token } = await loginRes.json();

        // 2. Upload Audio
        const formData = new FormData();
        formData.append('message', '');
        formData.append('language', 'English');
        formData.append('level', 'Basic');
        formData.append('history', '[]');
        formData.append('inputMethod', 'voice');

        // Read file and append
        const fileBuffer = fs.readFileSync(dummyAudioPath);
        const blob = new Blob([fileBuffer], { type: 'audio/webm' });
        formData.append('audio', blob, 'test_audio.webm');

        console.log('Sending request...');
        const chatRes = await fetch('http://localhost:3000/chat/message', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
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

testAudioUpload();
