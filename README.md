AI Chatbot – User Guide

This application is a simple web chatbot where you send messages through a browser and receive responses from an AI model.
The backend is built using Node.js + Express, and AI responses are obtained via the Hugging Face API.

How the Application Works
The user types a message in the chat interface in the browser.
The frontend sends the message to the backend via the POST /chat endpoint.
The server validates the message:
it must not be empty;
maximum length is 2000 characters.
The server sends a request to a Hugging Face chat model.
The response is returned to the frontend and displayed in the chat window.
Requirements
Node.js (recommended: LTS version)
npm
Hugging Face API token (HUGGINGFACE_API_KEY or HF_TOKEN)
Installation and Running
Navigate to the project folder and install dependencies:
npm install
Create a .env file in the root of the project:
HUGGINGFACE_API_KEY=your_token_here
PORT=3000
Start the server:
npm start
Open in your browser:

http://localhost:3000

Main Endpoints
POST /chat – send a message and receive an AI response
GET /health – check server status

In the /health response:

status: "ok" means the server is running
aiConfigured: true/false shows whether the API token is set
Common Errors
401 (Unauthorized): API token is invalid or expired.
429 (Rate limit): request limit exceeded; wait and try again.
502: issue receiving a response from the AI service.
Testing
npm test
Quick Notes
The chatbot will only work if a token is set in the .env file.
If you want to adjust response quality or style, modify the model parameters in the generateAIResponse() function inside server.js.
