const CHEF_TYPES = {
    KoreanStyle: {
        type: "KoreanStyle",
        name: "Chef Kim",
        img: "./assets/Ms.marlang.png",
    },
    AmericanStyle: {
        type: "AmericanStyle",
        name: "Chef Smith",
        img: "./assets/imoticon.png",
    },
    ChineseStyle: {
        type: "ChineseStyle",
        name: "Chef Li",
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
    // Add a bot message immediately introduce itself and asking for the user's name
    if (chefType === "KoreanStyle") {
        setTimeout(() => {
            displayMessage(
                "bot",
                "Hello! I am Chef Kim, renowned for my mastery of Korean cuisine. Let’s begin our culinary journey!"
            );
        }, 300);

        setTimeout(() => {
            displayMessage("bot", "May I know your name?");
            conversation.push({
                role: "assistant",
                content: "May I know your name?",
            });
        }, 1000);
    }
    if (chefType === "AmericanStyle") {
        setTimeout(() => {
            displayMessage(
                "bot",
                "Hey there! I am Chef Smith, known for my unrivaled mastery of American cuisine. Let’s begin this journey!"
            );
        }, 300);
        setTimeout(() => {
            displayMessage("bot", "What’s your name, partner?");
            conversation.push({
                role: "assistant",
                content: "What’s your name, partner?",
            });
        }, 1000);
    }
    if (chefType === "ChineseStyle") {
        setTimeout(() => {
            displayMessage(
                "bot",
                "Hello! I am Chef Li, renowned for my exceptional mastery of Chinese cuisine. Let’s begin this culinary journey!"
            );
        }, 300);
        setTimeout(() => {
            displayMessage("bot", "May I kindly ask for your name?");
            conversation.push({
                role: "assistant",
                content: "May I kindly ask for your name?",
            });
        }, 1000);
    }
}

function resetChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = ""; // Clear chat window
}

// Update chat header
function updateChatHeader(chef) {
    document.getElementById("selected-chef-avatar").src = chef.img;
    document.getElementById("selected-chef-name").textContent = chef.name;

    // Change status to Online once a chef is chosen
    const statusElement = document.getElementById("chat-header-status");
    statusElement.classList.add("online");
    statusElement.textContent = "Online";
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

    // Check if the last message is also from the bot,
    // and if so, don't show the profile pic
    const lastMessage = chatMessages.lastElementChild;
    const showProfilePic = !(
        sender === "bot" &&
        lastMessage &&
        lastMessage.classList.contains("bot")
    );

    // Prepare profile pic
    const profilePic = document.createElement("img");
    profilePic.src =
        sender === "user" ? "./assets/user.png" : selectedChefType.img;
    profilePic.classList.add("profile-pic");

    // Create chat bubble
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat-bubble");
    chatBubble.innerHTML = marked.parse(text); // Convert markdown to HTML

    if (sender === "user") {
        messageElement.appendChild(chatBubble);
        // messageElement.appendChild(profilePic);
    } else {
        if (showProfilePic) {
            messageElement.appendChild(profilePic);
        }
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
