const { OpenAI } = require('openai');

// Initialize OpenAI client for Groq or Gemini (using OpenAI compatibility)
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1', // Default to Groq if not specified
});

exports.askAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant for a Digital Health Record application.' },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
      messages,
    });

    res.json({
      answer: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error connecting to AI service' });
  }
};
