require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash-001',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite-preview-02-05'
    ];

    console.log("Testing models for availability and quota...");

    for (const modelName of models) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log(`✅ ${modelName}: SUCCESS - ${response.text().substring(0, 20)}...`);
        } catch (error) {
            console.log(`❌ ${modelName}: FAILED - ${error.message.split('\n')[0]}`);
        }
    }
}

testModels();
