async function analyzeCode() {
    // 1. Grabs the API Key pasted by the user directly from the text field
    const key = document.getElementById('apiKey').value.trim();
    const sourceCode = document.getElementById('codeInput').value;
    const language = document.getElementById('languageSelect').value;
    const display = document.getElementById('codeOutput');


    display.className = "output-view loading";
    display.innerText = "Processing architecture optimization vectors via Gemini 2.0 Flash...";

    // 2. Automatically appends the user's input key string directly to the URL route
    const endpoint = `https://googleapis.com{key}`;

    const instructionPrompt = `You are a strict, expert software security and code architecture reviewer. 
    Analyze the following ${language} block for efficiency issues, logical bugs, and maintainability flaws. 
    Provide clear bullet points detailing anomalies, followed by a cleanly refactored production-ready version of the code. 
    Keep your text concise and clean. Code to analyze:\n\n${sourceCode}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: instructionPrompt }] }]
            })
        });

        if(!response.ok) throw new Error("API rejection flag encountered.");

        const data = await response.json();
        const rawMarkdown = data.candidates[0].content.parts[0].text;
        
        display.className = "output-view";
        display.innerText = rawMarkdown;

    } catch (err) {
        display.className = "output-view error";
        display.innerText = "Runtime Error: Communication failure. Double check that your pasted API key is active and correct!";
    }
}
