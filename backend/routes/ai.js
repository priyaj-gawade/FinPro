const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fetch = require('node-fetch');
const Transaction = require('../models/Transaction');

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

    // Handle transaction-related queries
    const transactionResponse = await handleTransactionQuery(query, req.user.id);
    if (transactionResponse) {
      return res.json({ response: transactionResponse });
    }

    // Get language preference from request (default to English)
    const language = req.body.language || 'en';
    
    // Create system prompt with formatting instructions and language support
    const systemPrompt = `You are a helpful financial assistant.

**Quick Actions**:
- To add income, type: \`add, [category], [amount]\`
- To add an expense, type: \`sub, [category], [amount]\`

Please provide responses in a clean, readable format. Follow these guidelines:
1.  Start with a concise summary of no more than three lines.
2.  Follow the summary with actionable recommendations in a bulleted or numbered list.
3.  Each bullet point or numbered item must start on a new line.
4.  Use simple paragraphs with clear spacing.
5.  Do not use markdown formatting like '*' for bold or '#' for headings.
6.  Keep sentences grammatically correct and easy to understand.
7.  Respond in the ${language} language.`;

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
        max_tokens: 150,
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
    ).join('\\n');

    // Get language preference from request (default to English)
    const language = req.body.language || 'en';
    
    // Create system prompt with formatting instructions and language support
    const systemPrompt = `You are a helpful financial assistant and will reply in input language.

**Quick Actions**:
- To add income, type: \`add, [category], [amount]\`
- To add an expense, type: \`sub, [category], [amount]\`

Please provide responses in a clean, readable format. Follow these guidelines:
1.  Start with a concise summary of no more than three lines.
2.  Follow the summary with actionable recommendations in a bulleted or numbered list.
3.  Each bullet point or numbered item must start on a new line.
4.  Use simple paragraphs with clear spacing.
5.  Do not use markdown formatting like '*' for bold or '#' for headings.
6.  Keep sentences grammatically correct and easy to understand.
7.  Respond in the ${language} language.

When giving financial advice, use clear headings like "Summary:", "Analysis:", and "Recommendations:" on their own lines.`;

    // Create prompt for AI
    const prompt = `Based on these transactions:\\n${formattedTransactions}\\n\\nQuestion: ${question}\\n\\nPlease provide financial advice:`;

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
        max_tokens: 150,
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

async function handleTransactionQuery(query, userId) {
  const lowerCaseQuery = query.toLowerCase().trim();
  
  // Split by comma and then trim each part.
  const parts = lowerCaseQuery.split(',').map(p => p.trim());
  const action = parts[0];

  if (action === 'add' || action === 'sub') {
    const type = action === 'add' ? 'income' : 'expense';

    let category = parts.length > 1 ? parts[1] : null;
    let amountStr = parts.length > 2 ? parts[2] : null;

    if (!category || category === '') {
      return `Please provide a category for this ${type}. For example: '${action}, [category], [amount]'.`;
    }
    if (!amountStr || amountStr === '') {
      return `Please provide an amount for the '${category}' ${type}. For example: '${action}, ${category}, [amount]'.`;
    }

    const amount = parseFloat(amountStr.replace(/[^\\d.]/g, ''));

    if (isNaN(amount) || amount <= 0) {
      return 'Invalid amount. Please provide a valid positive number.';
    }
    
    // All parameters are present, create transaction
    const newTransaction = new Transaction({
      user: userId,
      amount,
      type,
      category: category,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} of ${amount} for ${category}`
    });

    await newTransaction.save();
    return `Transaction recorded: ${type} of ${amount} for ${category}.`;
  }

  // If it's not a transaction command, return null to proceed with normal AI query.
  return null;
}

module.exports = router;