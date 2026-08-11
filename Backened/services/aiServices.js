const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const reviewCode = async (code, language) => {

    const userPrompt = `
You are a senior software engineer and professional code reviewer.

Review the following ${language} code carefully.

Your review must be practical, specific, and easy for a developer to understand.

Analyze:

1. Overall code quality
2. bugs
3. Security vulnerabilities
4. Performance issues
5. Readability
6. Best practices
7. timecomplexity
8. spacecomplexity
9. Improved code
10.summary

Return ONLY this JSON structure:

{
  "summary": "",
  "bugs": [
    {
      "title": "",
      "severity": "",
      "recommendation": ""
    }
  ],
  "complexity": {
    "time": "",
    "space": ""
  }
}

Programming Language:
${language}

Code:
${code}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: userPrompt,

        config: {
            systemInstruction: `
You are an expert software engineer.

You must return ONLY valid JSON.

Never return markdown.
Never return explanations outside the JSON.
Always follow the requested JSON structure.

For every issue:
- Give a clear title
- Give a severity
- Explain the problem in a precise way
- Give a recommendation very precisely and whould be very short
`,

            responseMimeType: "application/json"
        }
    });

    const result = JSON.parse(response.text);

    return  {
        summary: result.summary,
        bugs: result.bugs,
        timeComplexity: result.complexity?.time,
        spaceComplexity: result.complexity?.space
    };
};

module.exports = {
    reviewCode
};