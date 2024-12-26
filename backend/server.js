const CHEF_TYPE = {
    KoreanStyle:
        "please make me a Korean dish. you are a master of Korean cuisine.",
    WesternStyle:
        "please make me a Western dish. you are a master of Western cuisine.",
    ChineseStyle:
        "please make me a Chinese dish. you are a master of Chinese cuisine.",
};

const OpenAI = require("openai");

const express = require("express"); // 서버 쉽게 만드는 거 도와주는 툴
require("dotenv").config(); // .env 파일에서 환경변수 불러오기
const cors = require("cors"); // cors 에러 해결 도와주는 툴

const app = express(); // 서버 만들기
app.use(cors()); // cors 에러 해결
app.use(express.json()); // json 형식으로 데이터 주고받기

// API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        // 프론트에서 보낸 메시지를 받아온다.
        const { message, chefType } = req.body;
        console.log("Chef type:", chefType);
        // gpt에게 전달해준다.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: CHEF_TYPE[chefType] }, // gpt
                {
                    role: "user",
                    content: message, // user
                },
            ],
        });
        console.log(completion.choices[0].message); // gpt가 보낸 답변
        const reply = completion.choices[0].message; // gpt 응답값 받아서
        res.status(200).json({ reply }); // 프론트로 응답값 전달
    } catch (error) {
        // 에러처리
        res.status(400).json({ error: "api request fail", rawError: error });
    }
});

// 포트 설정
app.listen(5001, () => {
    console.log("server is running on port 5001");
});
