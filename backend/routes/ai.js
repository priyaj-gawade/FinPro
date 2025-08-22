const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fetch = require('node-fetch');

// API constants
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

console.log('OpenRouter API will be used as the AI provider');
console.log('Using OpenRouter API URL:', OPENROUTER_API_URL);

// @route   POST api/ai/query
// @desc    Send a query to DeepSeek AI
// @access  Private
router.post('/query', auth, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    console.log('Processing AI query:', query);

    // Get language preference from request (default to English)
    const language = req.body.language || 'en';
    
    // Create system prompt with formatting instructions and language support
    const systemPrompt = `You are a helpful financial assistant. 
    
Please follow these formatting guidelines in your responses:
1. Use proper paragraphs with clear spacing between ideas
2. Use bullet points or numbered lists for multiple items
3. Use headings (with ** for bold) to organize sections
4. Keep sentences concise and clear
5. Respond in the ${language} language

For financial advice, structure your response with clear sections like "Summary", "Analysis", and "Recommendations".`;

    // Use OpenRouter API with DeepSeek R1 model
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fintooz.com',
        'X-Title': 'FinTooz'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return res.status(500).json({ message: 'Error from AI service', error: errorText });
    }

    const data = await response.json();
    console.log('OpenRouter API response received');
    
    const aiResponse = data.choices && data.choices[0] && data.choices[0].message ? 
      data.choices[0].message.content : 
      (data.output || 'No response from AI');

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI processing error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST api/ai/finance-advice
// @desc    Get financial advice based on transactions
// @access  Private
router.post('/finance-advice', auth, async (req, res) => {
  try {
    const { transactions, question } = req.body;
    
    if (!transactions || !question) {
      return res.status(400).json({ message: 'Transactions and question are required' });
    }

    // Format transactions for AI
    const formattedTransactions = transactions.map(t => 
      `${t.date.substring(0, 10)} | ${t.amount} | ${t.type} | ${t.category} | ${t.description}`
    ).join('\n');

    // Get language preference from request (default to English)
    const language = req.body.language || 'en';
    
    // Create system prompt with formatting instructions and language support
    const systemPrompt = `You are a helpful financial assistant. 
    
Please follow these formatting guidelines in your responses:
1. Use proper paragraphs with clear spacing between ideas
2. Use bullet points or numbered lists for multiple items
3. Use headings (with ** for bold) to organize sections
4. Keep sentences concise and clear
5. Respond in the ${language} language

For financial advice, structure your response with clear sections like "Summary", "Analysis", and "Recommendations".`;

    // Create prompt for AI
    const prompt = `Based on these transactions:\n${formattedTransactions}\n\nQuestion: ${question}\n\nPlease provide financial advice:`;

    // Use OpenRouter API with DeepSeek R1 model
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fintooz.com',
        'X-Title': 'FinTooz'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return res.status(500).json({ message: 'Error from AI service', error: errorText });
    }

    const data = await response.json();
    console.log('OpenRouter API response:', JSON.stringify(data));
    
    const aiResponse = data.choices && data.choices[0] && data.choices[0].message ? 
      data.choices[0].message.content : 
      (data.output || 'No response from AI');

    res.json({ advice: aiResponse });
  } catch (error) {
    console.error('AI processing error:', error.message);
    res.status(500).json({ message: 'Error processing your request', error: error.message });
  }
});

module.exports = router;