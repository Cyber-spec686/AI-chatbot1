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

Features

Clean Bootstrap-based chat interface
- Express backend with `/chat` and `/health` endpoints
- Input validation and graceful error responses
- Basic automate
## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Open:
   `http://localhost:3000`

## Scripts

- `npm start` - run the server
- `npm test` - run automated tests

## Project Structure

```text
.
├── server.js
├── server.test.js
├── public/
│   └── index.html
├── package.json
└── README.md
```

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
