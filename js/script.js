const CHEF_TYPES = {
    KoreanStyle: {
        type: "KoreanStyle",
        name: "Mr. Leo",
        img: "./assets/imoticon.png",
    },
    WesternStyle: {
        type: "WesternStyle",
        name: "Ms. Marlang",
        img: "./assets/Ms.marlang.png",
    },
    ChineseStyle: {
        type: "ChineseStyle",
        name: "Yeongjun",
        img: "./assets/Leo.png",
    },
};

let selectedChefType = null;

// Chef 선택 후 채팅 초기화
function selectChef(chefType) {
    // 이전 선택 초기화
    document.querySelectorAll(".chef-option").forEach((option) => {
        option.classList.remove("selected");
    });

    // 새로운 선택 하이라이트
    const selectedElement = document.querySelector(
        `.chef-option[onclick*="${chefType}"]`
    );
    selectedElement.classList.add("selected");

    // 선택된 chef 정보 저장
    selectedChefType = CHEF_TYPES[chefType];

    // 헤더 정보 업데이트
    updateChatHeader(selectedChefType);

    // 채팅 리셋
    resetChat();
}

function resetChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = ""; // 채팅창 비우기
}

// 채팅 헤더 업데이트
function updateChatHeader(chef) {
    document.getElementById("selected-chef-avatar").src = chef.img;
    document.getElementById("selected-chef-name").textContent = chef.name;
}

// 메시지 전송
function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (message) {
        displayMessage("user", message);
        input.value = ""; // 메시지 전송 후 input 비우기
        fetchResponse(message);
    }
}

function displayMessage(sender, text) {
    const chatMessages = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);

    const profilePic = document.createElement("img");
    profilePic.src =
        sender === "user" ? "./assets/user.png" : selectedChefType.img;
    profilePic.classList.add("profile-pic");

    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");
    chatBubble.innerHTML = marked.parse(text); // Convert Markdown to HTML

    if (sender === "user") {
        messageElement.appendChild(chatBubble);
        messageElement.appendChild(profilePic);
    } else {
        messageElement.appendChild(profilePic);
        messageElement.appendChild(chatBubble);
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchResponse(message) {
    try {
        const response = await fetch("http://localhost:5001/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, chefType: selectedChefType.type }),
        });
        const data = await response.json();
        displayMessage("bot", data.reply.content);
    } catch (error) {
        displayMessage("bot", "Sorry, something went wrong. Please try again.");
    }
}
