require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For some reason the SDK doesn't expose listModels directly on the main class easily in all versions,
        // but let's try to infer or just test a few common ones.
        // Actually, the error message suggested calling ListModels.
        // The SDK usually has a ModelManager or similar.
        // Let's try a simple generation with 'gemini-pro' to see if THAT works, as a baseline.

        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-1.5-flash-002', 'gemini-1.5-pro', 'gemini-pro'];

        console.log("Testing models...");

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${modelName} is AVAILABLE.`);
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
