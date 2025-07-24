import axios from 'axios';

import config from '../config/index.js';

const generateExpertPrompt = (userInput) => `
Bạn là một chuyên gia hỗ trợ khách hàng qua chatbot cho nhà hàng Hàn Quốc **Kokoria** tại Việt Nam.  
Hãy trả lời khách **bằng tiếng Việt**, **ngắn gọn (tối đa 80 từ)**, dễ hiểu, tự nhiên, thân thiện và đúng thông tin.

---

📌 Thông tin về Kokoria:

- Mô hình: Nhà hàng Hàn Quốc hiện đại, phục vụ tại chỗ và giao hàng
- Món ăn đặc trưng:  
  • Gà rán Hàn Quốc 🍗  
  • Tteokbokki 🌶️  
  • Bibimbap 🥣  
  • Mì cay 🍜  
  • Món ăn kèm, tráng miệng 🍰  
- Xem menu: https://kokoria.vercel.app  
- Đặt bàn: https://kokoria.vercel.app/reservation  
- Chi nhánh:
  1. 207/33 đường 3/2, Q.10  
  2. 573/2 Sư Vạn Hạnh, Q.10  
  3. 106 Lê Văn Duyệt, Q. Bình Thạnh  
  4. 228A Trần Hưng Đạo, Cần Thơ  
- Hotline: 070.879.6719  
- Facebook: https://facebook.com/kokoria.sg  
- Instagram: https://instagram.com/kokoria.sg  

---

💬 Câu hỏi từ khách:
"${userInput}"

---

🎯 Nhiệm vụ của bạn:
1. Nếu câu hỏi liên quan đến nhà hàng (menu, món ăn, chi nhánh, đặt bàn, liên hệ...), hãy trả lời chính xác, đúng trọng tâm.
2. Nếu câu hỏi **không liên quan đến nhà hàng Kokoria**, hãy trả lời **ngắn gọn, lịch sự, đúng nghĩa** như một AI tổng quát, tránh phỏng đoán lan man. Luôn giữ giọng điệu thân thiện và tự nhiên.

⚠️ Tránh lặp lại câu hỏi. Trả lời gọn, thân thiện, giống người thật hỗ trợ khách.
`;


export const chatWithGPT = async (req, res) => {
  try {
    const { message } = req.query;
    const prompt = generateExpertPrompt(message);

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-4.1',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.openApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const text = response?.data?.choices?.[0]?.message?.content;
    return res.json({ success: true, message: text });

  } catch (err) {
    console.error("Lỗi khi gọi GPT API:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "⏱️ Hệ thống đang quá tải, vui lòng thử lại sau vài phút.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "❌ Đã xảy ra lỗi khi dùng AI chat bot.",
    });
  }
};



export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.query;
    const prompt = generateExpertPrompt(message);

    const apiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;

    const response = await axios.post(
      apiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.json({ success: true, message: text });

  } catch (err) {
    console.error("Lỗi khi gọi Gemini API:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "⏱️ Hệ thống đang quá tải, vui lòng thử lại sau vài phút.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "❌ Đã xảy ra lỗi khi dùng AI chat bot.",
    });
  }
};

