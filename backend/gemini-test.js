
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in backend/.env");
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Reply with exactly: Gemini AI connected successfully!",
        });

        console.log("Gemini response:", response.text);
    } catch (error) {
        console.error("Gemini test failed:", error.message);
    }
}

testGemini();
