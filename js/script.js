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
// Create an array to store all messages (user + assistant) to maintain context
let conversation = [];

// Initialize chat after selecting Chef
function selectChef(chefType) {
    // Reset previous selection
    document.querySelectorAll(".chef-option").forEach((option) => {
        option.classList.remove("selected");
    });

    // Highlight new selection
    const selectedElement = document.querySelector(
        `.chef-option[onclick*="${chefType}"]`
    );
    selectedElement.classList.add("selected");

    // Store selected chef information
    selectedChefType = CHEF_TYPES[chefType];

    // Update header information
    updateChatHeader(selectedChefType);

    // Reset chat
    resetChat();
    conversation = []; // Reset previous conversation
    // System-level message is appended to give the AI information about the chef
    conversation.push({
        role: "system",
        content:
            CHEF_TYPES[chefType].name +
            " is a chef: specializes in " +
            CHEF_TYPES[chefType].type,
    });
}

function resetChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = ""; // Clear chat window
}

// Update chat header
function updateChatHeader(chef) {
    document.getElementById("selected-chef-avatar").src = chef.img;
    document.getElementById("selected-chef-name").textContent = chef.name;
}

// Send message
function sendMessage() {
    if (!selectedChefType) {
        alert("Please select a chef first.");
        return;
    }
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (message) {
        displayMessage("user", message);
        // Add the user's latest message here so the model can remember it later
        conversation.push({ role: "user", content: message }); // Store user message
        input.value = ""; // Clear input after sending message
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
            // The entire conversation array is sent so the model maintains previous context
            body: JSON.stringify({
                message,
                chefType: selectedChefType.type,
                conversation,
            }),
        });
        const data = await response.json();
        displayMessage("bot", data.reply.content);
        // After receiving the response, add the assistant's updated reply to the conversation
        conversation.push({ role: "assistant", content: data.reply.content }); // Store bot response
    } catch (error) {
        displayMessage("bot", "Sorry, something went wrong. Please try again.");
    }
}
