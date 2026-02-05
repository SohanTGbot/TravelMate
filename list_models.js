
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Manually load env file since we are running a script
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envProdPath = path.resolve(process.cwd(), '.env.production.local');

let apiKey = '';

if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    if (envConfig.GEMINI_API_KEY) apiKey = envConfig.GEMINI_API_KEY;
}

if (!apiKey && fs.existsSync(envProdPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envProdPath));
    if (envConfig.GEMINI_API_KEY) apiKey = envConfig.GEMINI_API_KEY;
}

if (!apiKey) {
    console.error("Could not find GEMINI_API_KEY in .env.local or .env.production.local");
    process.exit(1);
}

console.log(`Using API Key: ${apiKey.substring(0, 10)}...`);

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const response = await ai.models.list();
        // The new SDK might return an iterable or explicit list object
        console.log("Available Models:");
        for await (const model of response) {
            console.log(`- ${model.name} (Methods: ${model.supportedGenerationMethods?.join(', ')})`);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
