const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

// Secure Local Key Storage
const API_KEY = process.env.GEMINI_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/review', async (req, res) => {
    const { sourceCode, language } = req.body;

    try {
        // Change this line inside your server.js /api/review route:
        const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

        const promptText = `Review this ${language} code snippet for performance bottlenecks, clean code practices, and security bugs. Provide bullet points of the bugs/improvements followed by the corrected refactored code block:\n\n${sourceCode}`;

        const result = await model.generateContent(promptText);
        const responseText = result.response.text();

        if (responseText) {
            res.json({ text: responseText });
        } else {
            res.status(500).json({ error: "Empty text returned from Gemini." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 System active! Open http://localhost:${PORT} in your browser.`));
