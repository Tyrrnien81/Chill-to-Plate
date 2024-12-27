const CHEF_TYPE = {
    KoreanStyle:
        "please make me a Korean dish. you are a master of Korean cuisine.",
    WesternStyle:
        "please make me a Western dish. you are a master of Western cuisine.",
    ChineseStyle:
        "please make me a Chinese dish. you are a master of Chinese cuisine.",
};

const OpenAI = require("openai");

const express = require("express"); // Tool for easy server creation
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors"); // Tool for handling CORS errors

const app = express(); // Create server
app.use(cors()); // Resolve CORS issues
app.use(express.json()); // Handle JSON data format

// API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        // Receive message from frontend
        const { message, chefType, conversation } = req.body;
        console.log("Message:", message);
        console.log("Chef type:", chefType);
        console.log("Conversation:", conversation);
        // Send to GPT
        // Merge the conversation array from the client with the system prompt
        // to preserve context
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: CHEF_TYPE[chefType] }, // gpt
                ...conversation,
            ],
        });
        console.log(completion.choices[0].message); // Log GPT's response
        const reply = completion.choices[0].message; // Get GPT response
        res.status(200).json({ reply }); // Send response to frontend
    } catch (error) {
        // Error handling
        res.status(400).json({ error: "api request fail", rawError: error });
    }
});

// Port configuration
app.listen(5001, () => {
    console.log("server is running on port 5001");
});
