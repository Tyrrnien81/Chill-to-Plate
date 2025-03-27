# 🍳 Chill to Plate

Welcome to the Chill to Plate project! This repository contains a web application that leverages OpenAI's model to provide personalized cooking ideas based on the ingredients in your refrigerator. The application guides you through step-by-step recipes, ensuring a delightful cooking experience. Upon selecting a Chef, the corresponding AI will appear, ask for your name and ingredients, and then suggest various cooking ideas.

-   Live Demo: [Play Now](https://tyrrnien81.github.io/Chill-to-Plate/)

## 🎯 Key Features

-   **Chef Selection**: Start a conversation by selecting from various Chefs (Korean, Chinese, American).
-   **Personalized Recipe Recommendations**: AI recommends recipes based on the ingredients you provide.
-   **Step-by-Step Cooking Instructions**: Detailed cooking instructions, tips, and precautions for each recipe.
-   **Contextual Conversation**: Stores conversation history to maintain context throughout the interaction.

## 🏗️ Project Structure

-   **/frontend/public/index.html**: Main HTML entry for the React app
-   **/frontend/src/App.js**: Main React component handling chat logic
-   **/frontend/src/style.css**: UI styles for the frontend
-   **/backend/server.js**: Node.js-based server handling OpenAI API calls
-   **/backend/.env**: Environment variables for API keys and configurations

## 💡 How It Works

-   **User Chooses a Chef**: On the main page (index.html), the user selects a Chef and waits for the chat header to display “Online”.
-   **User Provides Input**: The AI asks for the user’s name and available ingredients.
-   **Server Communication**: A request is sent from the browser to the backend server (Node.js). The server then forwards the conversation to the OpenAI API along with relevant parameters.
-   **OpenAI Processing**: The AI model (GPT-4o-mini) processes the prompt and returns a response.
-   **Response Display**: The server sends back the AI response to the browser, and the user interface displays the suggestions or next steps.

## 🚀 Installation and Execution

Follow these steps to set up and run the project locally:

1. **Clone the Repository and Install Dependencies**

    ```bash
    git clone https://github.com/Tyrrnien81/Chill-to-Plate.git
    cd Chill-to-Plate-main
    cd frontend
    npm install
    cd backend
    npm install
    ```

2. **Set Up Environment Variables**

    - Create a **.env** file in the backend directory and specify your `OPENAI_API_KEY`.
    - Example:
        ```plaintext
        OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
        ```

3. **Run the Frontend and Server**

    - Frontend:
        ```bash
        cd frontend
        npm start
        ```
    - Backend:
        ```bash
        cd ../backend
        node server.js
        ```

4. **Access the Web App**
    - Open http://localhost:3000 in your browser

## 🍽️ Usage

-   **Select a Chef**: Choose a Chef from the available options.
-   **Confirm "Online" Status**: Ensure the chat header status changes to "Online".
-   **Start Chatting**: Enter your message in the chat area and press Enter or click Send.
-   **Follow Prompts**: Provide your name, list ingredients, and select a recipe as prompted by the AI.

## 🔧 Technology Stack

-   **Frontend**: React (Create React App)
-   **Backend**: Node.js, Express.js, OpenAI SDK
-   **AI Model**: GPT-4o-mini (Generative Pre-trained Transformer)

## 🤝 Contribution Guidelines

We welcome contributions to enhance this project. Follow these steps to contribute:

1. **Fork the Repository**: Click the "Fork" button at the top right of this page.
2. **Create a New Branch**: Create a new branch for your feature or bug fix.
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Make Your Changes**: Implement your feature or bug fix.
4. **Commit Your Changes**: Commit your changes with a descriptive commit message.
    ```bash
    git commit -m "Add feature: your-feature-name"
    ```
5. **Push to the Branch**: Push your changes to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
6. **Submit a Pull Request**: Open a pull request to the main repository.

## 📜 License

This project is licensed under the MIT License. You are free to use it for personal and educational purposes. For commercial use, please contact us.

---

Thank you for using Chill to Plate! We hope you enjoy your cooking experience with our AI-powered assistant. If you have any questions or feedback, feel free to open an issue or contact us directly.
