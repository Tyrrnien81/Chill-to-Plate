import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import "./style.css";
import { marked } from "marked";

const CHEF_TYPES = {
    KoreanStyle: {
        type: "KoreanStyle",
        name: "Chef Shin",
        img: process.env.PUBLIC_URL + "/assets/Chef-Shin.webp", // updated path
        greeting:
            "Hello! I am Chef Shin, renowned for my mastery of Korean cuisine. Let’s begin our culinary journey!",
        askName: "May I kindly ask for your name?",
    },
    ChineseStyle: {
        type: "ChineseStyle",
        name: "Chef Jun",
        img: process.env.PUBLIC_URL + "/assets/Chef-Jun.webp", // updated path
        greeting:
            "Hello! I am Chef Jun, renowned for my exceptional mastery of Chinese cuisine. Let’s begin our culinary journey!",
        askName: "May I know your name?",
    },
    AmericanStyle: {
        type: "AmericanStyle",
        name: "Chef Smith",
        img: process.env.PUBLIC_URL + "/assets/Chef-Smith.webp", // updated path
        greeting:
            "Hey there! I am Chef Smith, known for my unrivaled mastery of American cuisine. Let’s begin this journey!",
        askName: "What’s your name, partner?",
    },
};

function App() {
    const [selectedChef, setSelectedChef] = useState(null);
    const [conversation, setConversation] = useState([]); // 메시지 저장
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null); // 새 ref 추가

    // 스크롤 자동 이동: conversation이 변화할 때마다 호출
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation]);

    // chef 선택 시 상태 갱신 및 초기 메시지 추가
    const handleSelectChef = (chefKey) => {
        const chef = CHEF_TYPES[chefKey];
        setSelectedChef(chef);
        setConversation([]);
        setTimeout(() => {
            setConversation((prev) => [
                ...prev,
                { role: "assistant", content: chef.greeting },
            ]);
        }, 300);
        setTimeout(() => {
            setConversation((prev) => [
                ...prev,
                { role: "assistant", content: chef.askName },
            ]);
        }, 1000);
    };

    // 메시지 전송 및 백엔드 fetch 호출
    const handleSendMessage = async () => {
        if (!selectedChef) {
            alert("Please select a chef first.");
            return;
        }
        if (!inputMessage.trim()) return;
        const userMessage = inputMessage.trim();
        setConversation((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        setInputMessage("");

        try {
            const response = await fetch("http://3.141.24.68:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    chefType: selectedChef.type,
                    conversation: conversation.concat({
                        role: "user",
                        content: userMessage,
                    }),
                }),
            });
            const data = await response.json();
            setConversation((prev) => [
                ...prev,
                { role: "assistant", content: data.reply.content },
            ]);
        } catch (error) {
            setConversation((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again.",
                },
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <>
            <Helmet>
                <title>Chill to Plate</title>
            </Helmet>
            <div className="container">
                <div className="chef-selection">
                    <h2>Chill to Plate</h2>
                    <div className="chef-list">
                        {Object.keys(CHEF_TYPES).map((key) => (
                            <div
                                key={key}
                                className={`chef-option ${
                                    selectedChef &&
                                    selectedChef.type === CHEF_TYPES[key].type
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => handleSelectChef(key)}
                            >
                                <img
                                    src={CHEF_TYPES[key].img} // now uses updated path from CHEF_TYPES
                                    alt={CHEF_TYPES[key].name}
                                />
                                <h3>{CHEF_TYPES[key].name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-container">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <img
                                id="selected-chef-avatar"
                                src={
                                    selectedChef
                                        ? selectedChef.img
                                        : process.env.PUBLIC_URL +
                                          "/assets/bot-avatar.png" // updated path
                                }
                                alt="Selected Chef"
                            />
                            <div className="chat-header-text">
                                <h3 id="selected-chef-name">
                                    {selectedChef
                                        ? selectedChef.name
                                        : "Choose a chef..."}
                                </h3>
                                <span
                                    id="chat-header-status"
                                    className={selectedChef ? "online" : ""}
                                >
                                    {selectedChef ? "Online" : "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id="chat-messages">
                        {conversation.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.role === "assistant" && (
                                    // 봇 메시지일 경우 프로필 이미지 표시
                                    <img
                                        src={
                                            selectedChef
                                                ? selectedChef.img
                                                : process.env.PUBLIC_URL +
                                                  "/assets/bot-avatar.png" // updated path
                                        }
                                        alt="Bot"
                                        className="profile-pic"
                                    />
                                )}
                                <div
                                    className="chat-bubble"
                                    dangerouslySetInnerHTML={{
                                        __html: marked.parse(msg.content),
                                    }}
                                ></div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* 스크롤 대상 요소 */}
                    </div>
                    <div className="chat-input-area">
                        <input
                            type="text"
                            id="chat-input"
                            placeholder="Enter your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button id="send-button" onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
