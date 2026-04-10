const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const MAX_MESSAGE_LENGTH = 2000;
const AI_TIMEOUT_MS = 30000;

app.use(express.json());
app.use(express.static('public'));

// Simple response system that doesn't require API keys
function generateResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Simple pattern-based responses
    const responses = {
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! What can I help you with?',
        'how are you': 'I\'m doing great! How can I help you?',
        'what is your name': 'I\'m an AI Assistant. Nice to meet you!',
        'thank you': 'You\'re welcome! Is there anything else I can help with?',
        'thanks': 'Happy to help! Feel free to ask me anything.',
        'bye': 'Goodbye! Have a great day!',
    };
    
    // Check for exact match
    if (responses[msg]) {
        return responses[msg];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(responses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    // Intelligent reflection response
    if (msg.length > 0) {
        const question = msg.endsWith('?') ? 'That\'s an interesting question!' : 'That sounds interesting!';
        return `${question} You said: "${message}". I\'m here to help with any questions you have. Feel free to ask me anything!`;
    }
    
    return 'I\'m not sure how to respond to that. Could you ask me something?';
}

async function generateAIResponse(message) {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
        throw new Error('HUGGINGFACE_API_KEY is not configured');
    }

    const { data } = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        {
            model: 'meta-llama/Llama-3.1-8B-Instruct',
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Respond clearly and briefly.' },
                { role: 'user', content: message }
            ],
            max_tokens: 220,
            temperature: 0.7
        },
        {
            timeout: AI_TIMEOUT_MS,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    const text = data?.choices?.[0]?.message?.content;
    if (typeof text === 'string' && text.trim()) {
        return text.trim();
    }

    throw new Error('AI service returned an unexpected response format');
}

app.post('/chat', async (req, res) => {
    console.log('Received request:', req.body);
    const { message } = req.body;
    
    if (typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message must be a non-empty string' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return res.status(413).json({ error: `Message is too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.` });
    }

    try {
        let botResponse;
        try {
            botResponse = await generateAIResponse(message);
            console.log('AI response sent');
        } catch (aiError) {
            console.error('AI error, using fallback:', aiError.message);
            botResponse = generateResponse(message);
        }

        console.log('Sending response:', botResponse);
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error.message);
        res.json({ response: 'I could not process your message. Please try again.' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', aiConfigured: Boolean(process.env.HUGGINGFACE_API_KEY) });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = { app, generateResponse, generateAIResponse };
