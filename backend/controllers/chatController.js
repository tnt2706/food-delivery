import axios from 'axios';

import config from '../config/index.js';

export const chatWithGPT = async (req, res) => {
  try {
    const {message} = req.query;

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',  // hoặc "gpt-3.5-turbo"
          messages: [{role: 'user', content: message}],
        },
        {
          headers: {
            Authorization: `Bearer ${config.openApiKey}`,
            'Content-Type': 'application/json',
          },
        });

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('GPT API error:', err.response?.data || err.message);
    throw new Error('ChatGPT API Error');
  }
};


export const chatWithGemini = async (message) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${config.geminiApiKey}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "Không có phản hồi từ Gemini.";
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    throw new Error("Gemini API Error");
  }
};
