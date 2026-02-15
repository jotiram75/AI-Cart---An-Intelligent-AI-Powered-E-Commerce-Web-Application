import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log("Testing with API Key present:", !!API_KEY);

if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, just verifying connection.");
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        return true;
    } catch (error) {
        console.error(`❌ FAILED: ${modelName}`);
        console.error(`   Reason: ${error.message.split('\n')[0]}`);
        return false;
    }
}

async function run() {
    console.log("Starting Model Verification Check...");
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
    
    for (const m of models) {
        await testModel(m);
    }
    console.log("\nDone.");
}

run();
