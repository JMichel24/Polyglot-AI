require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ Success with ${modelName}! Response:`, result.response.text());
        return true;
    } catch (error) {
        console.log(`❌ Failed with ${modelName}.`);
        console.log("Error Message:", error.message);
        // console.log("Full Error:", JSON.stringify(error, null, 2));
        return false;
    }
}

async function runTests() {
    console.log("API Key:", apiKey ? "Present" : "Missing");

    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const model of models) {
        const success = await testModel(model);
        if (success) break;
    }
}

runTests();
