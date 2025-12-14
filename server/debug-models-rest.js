require('dotenv').config();
const fs = require('fs');

async function debugModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', names);
            console.log("Models written to models.txt");
        } else {
            console.log("NO_MODELS_FOUND");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("ERROR:", error);
    }
}

debugModels();
