// Function to update file extension title dynamically when you toggle languages
function updatePlaceholder() {
    const lang = document.getElementById('languageSelect').value;
    const title = document.getElementById('editorTitle');
    const extensions = { JavaScript: 'js', Python: 'py', TypeScript: 'ts', 'C++': 'cpp', Java: 'java' };
    title.innerText = `source_code.${extensions[lang] || 'txt'}`;
}

async function analyzeCode() {
    const sourceCode = document.getElementById('codeInput').value;
    const language = document.getElementById('languageSelect').value;
    const display = document.getElementById('codeOutput');

    display.className = "output-view loading";
    display.innerText = "Analyzing code structure with Gemini 2.0 Flash...";

    // This placeholder matches your Render environment replacement script perfectly
    const API_KEY = "RENDER_PLACEHOLDER_KEY"; 
    
    // FIXED: Correct full endpoint URL structure for Gemini 2.0 Flash
    const endpoint = `https://googleapis.com{API_KEY}`;

    const promptText = `Review this ${language} code snippet for performance bottlenecks, clean code practices, and security bugs. Provide bullet points of the bugs/improvements followed by the corrected refactored code block:\n\n${sourceCode}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) throw new Error("API call failed.");

        const data = await response.json();
        
        // FIXED: Solid, absolute path to extract text cleanly from the API response payload
        display.className = "output-view";
        display.innerText = data.candidates[0].content.parts[0].text;

    } catch (err) {
        display.className = "output-view error";
        display.innerText = "Analysis Failed: Connection error or invalid API key environment configuration.";
    }
}
