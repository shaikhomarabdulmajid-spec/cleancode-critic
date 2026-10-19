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

    // Matches your Render environment replacement script
    const API_KEY = "RENDER_PLACEHOLDER_KEY"; 
    
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

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorDetails}`);
        }

        const data = await response.json();
        
        // Flexible extraction mapping to handle variations in Gemini's response formatting safely
        let extractedText = "";
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            extractedText = data.candidates[0].content.parts[0].text;
        } else if (data.candidates && data.candidates.content && data.candidates.content.parts) {
            extractedText = data.candidates.content.parts.text;
        } else {
            throw new Error("Unexpected API JSON structure received.");
        }

        display.className = "output-view";
        display.innerText = extractedText;

    } catch (err) {
        display.className = "output-view error";
        // Shows you the exact technical issue (e.g., bad key, bad text parse) instead of a generic text loop
        display.innerText = `Analysis Failed: ${err.message}`;
    }
}
