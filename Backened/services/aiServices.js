const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const key = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const reviewCode = async(code)=>{
    const userprompt = `You are an expert software engineer.

Review the following JavaScript code.

Return only JSON with the following format:

{
 "score":0,
 "bugs":[],
 "security":[],
 "performance":[],
 "readability":[],
 "improvedCode":"",
 "summary":""
}

Code:
${code}
`;

    const completion = await key.models.generateContent({

        model: "gemini-2.5-flash",
        contents: userprompt,
        config: {
            responseMimeType: "application/json",
            systemInstruction: "You are an expert code reviewer.",
        },
    });

    return JSON.parse(completion.text);
}

module.exports = {
    reviewCode
};
