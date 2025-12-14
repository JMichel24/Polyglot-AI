// Minimal valid WAV file (silence)
const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x24, 0x00, 0x00, 0x00, // Chunk size
    0x57, 0x41, 0x56, 0x45, // WAVE
    0x66, 0x6d, 0x74, 0x20, // fmt 
    0x10, 0x00, 0x00, 0x00, // Subchunk1Size
    0x01, 0x00,             // AudioFormat (PCM)
    0x01, 0x00,             // NumChannels (1)
    0x44, 0xac, 0x00, 0x00, // SampleRate (44100)
    0x88, 0x58, 0x01, 0x00, // ByteRate
    0x02, 0x00,             // BlockAlign
    0x10, 0x00,             // BitsPerSample (16)
    0x64, 0x61, 0x74, 0x61, // data
    0x00, 0x00, 0x00, 0x00  // Subchunk2Size (0 bytes of data)
]);

const FormData = require('form-data');
// const fetch = require('node-fetch'); // Native in Node 18+

async function testAudio() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'newuser123', password: 'password' })
        });
        const { token } = await loginRes.json();
        console.log('Login successful');

        // 2. Send Audio
        const form = new FormData();
        form.append('message', ''); // Empty message for audio-only
        form.append('language', 'Spanish');
        form.append('level', 'Basic');
        form.append('inputMethod', 'voice');
        form.append('audio', wavHeader, {
            filename: 'test.wav',
            contentType: 'audio/wav',
        });

        // Need to handle headers manually for FormData with native fetch if not using a library that does it automatically
        // But form-data library provides getHeaders()

        // NOTE: Native fetch with FormData from 'form-data' package can be tricky.
        // Let's try to construct the request carefully.

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...form.getHeaders()
            },
            body: form
        };

        const res = await fetch('http://localhost:3000/chat/message', options);

        if (!res.ok) {
            const text = await res.text();
            console.error('Error:', res.status, text);
        } else {
            const data = await res.json();
            console.log('Success:', data);
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAudio();
