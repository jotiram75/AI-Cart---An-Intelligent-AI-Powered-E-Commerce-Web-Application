import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API KEY found");
    process.exit(1);
}

import fs from 'fs';

const listModels = async () => {
    let logBuffer = "";
    const log = (msg) => { console.log(msg); logBuffer += msg + "\n"; };

    try {
        log("Checking available models...");
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        
        log("\n----- AVAILABLE MODELS -----");
        const models = response.data.models;
        
        const geminiModels = models.filter(m => m.name.includes("gemini"));
        
        if (geminiModels.length === 0) {
            log("No Gemini models found! (Only PaLM/legacy ones?)");
            models.forEach(m => log(`- ${m.name}`));
        } else {
            geminiModels.forEach(m => {
                log(`Name: ${m.name}`);
                log(`Display: ${m.displayName}`);
                log(`Supported: ${m.supportedGenerationMethods.join(", ")}`);
                log("---");
            });
        }
        log("\n----------------------------");
        
    } catch (error) {
        log("\nAPI CHECK FAILED");
        if (error.response) {
            log(`Status: ${error.response.status}`);
            log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            log(error.message);
        }
    } finally {
        fs.writeFileSync('api_log.txt', logBuffer, 'utf8');
    }
};

listModels();
