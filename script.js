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
    display.innerText = "Analyzing code structure securely with Gemini 2.0 Flash...";

    try {
        const response = await fetch('/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceCode, language })
        });

        const data = await response.json();

        if (response.ok) {
            display.className = "output-view";
            display.innerText = data.text;
        } else {
            display.className = "output-view error";
            display.innerText = "Analysis Failed: " + data.error;
        }
    } catch (err) {
        display.className = "output-view error";
        display.innerText = "Connection Error: Cannot communicate with your local server process.";
    }
}
