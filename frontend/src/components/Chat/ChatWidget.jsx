import React, { useState, useContext } from "react";
import "./ChatWidget.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { getBestMatchingResponse } from "../../utils/chatMatcher";
import chatData from "./chatData.json";

const chatOptions = [
    { emoji: "🍽️", label: "Bạn có món gì trong menu?" },
    { emoji: "🔔", label: "Tôi muốn đặt bàn" },
    { emoji: "📅", label: "Xem lại bàn tôi đã đặt" },
    { emoji: "📞", label: "Liên hệ với bạn bằng cách nào?" },
    { emoji: "📩", label: "Tôi muốn để lại góp ý" },
    { emoji: "🔍", label: "Tôi có câu hỏi khác" }
];

const ChatWidget = () => {
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    const [isVisible, setIsVisible] = useState(true);
    const [messages, setMessages] = useState([
        { type: "bot", text: "👋 Xin chào! Mình có thể giúp gì cho bạn?" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    const sendMessage = (type, text) => {
        setMessages((prev) => [...prev, { type, text }]);
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "✅";
            case "pending": return "⏳";
            case "cancelled": return "❌";
            case "completed": return "✨";
            default: return "📋";
        }
    };

    const getListReservation = async () => {
        try {
            const response = await axios.get(`${url}/api/reservation/list`, {
                headers: { token },
            });

            const data = response?.data?.data || [];
            if (data.length === 0) return "Hiện tại bạn chưa có bàn nào được đặt.";

            let message = "\n📋 **Danh sách đặt bàn của bạn**\n\n";
            for (let reservation of data) {
                const date = reservation.date || "Không có thời gian";
                const branch = reservation.branch || "Không có chi nhánh";
                const guests = reservation.guests || "Không rõ";
                const status = reservation.status || "pending";
                const statusIcon = getStatusIcon(status);

                message += `───────────────\n`;
                message += `🕒 Thời gian: ${date}\n`;
                message += `📍 Chi nhánh: ${branch}\n`;
                message += `👥 Số khách: ${guests}\n`;
                message += `📌 Trạng thái: ${statusIcon} ${status}\n\n`;
            }

            message += `───────────────\n**Tổng cộng: ${data.length} lượt đặt bàn**`;
            return message;
        } catch (error) {
            console.error("Failed to fetch reservation list:", error);
            return "❌ Có lỗi xảy ra khi lấy danh sách đặt bàn. Vui lòng thử lại sau.";
        }
    };


    const callGemini = async (message) => {
        try {
            const response = await axios.get(`${url}/api/chat/gemini`,
                {
                    params: { message },
                }
            );

            const reply = response?.data?.message || "Không nhận được phản hồi từ Gemini.";
            return reply;
        } catch (error) {
            console.error("Lỗi khi gọi Gemini:", error);
            return "❌ Có lỗi xảy ra khi gửi câu hỏi đến chat bot. Vui lòng hãy thử lại!";
        }
    };

    const handleOptionClick = async (optionOrText) => {
        const label = typeof optionOrText === "string" ? optionOrText : optionOrText.label;
        sendMessage("user", label);

        switch (label) {
            case "Bạn có món gì trong menu?":
                sendMessage("bot", `👉 Xem menu đầy đủ tại: https://kokoria.vercel.app\n• Chicken 🍗  \n• K-Food 🇰🇷  \n• Tteokbokki 🌶️  \n• Bibimbap 🥣  \n• Sides 🍟  \n• Desserts 🍰`);
                break;
            case "Tôi muốn đặt bàn":
                sendMessage("bot", `🔔 Đưa bạn đến trang đặt bàn...`);
                setTimeout(() => navigate("/reservation"), 600);
                break;
            case "Xem lại bàn tôi đã đặt":
                const msg = await getListReservation();
                sendMessage("bot", msg);
                break;
            case "Liên hệ với bạn bằng cách nào?":
                sendMessage("bot", `📞 Bạn có thể gọi đến **070.879.6719** hoặc nhắn trực tiếp ở đây nhé!`);
                break;
            case "Tôi muốn để lại góp ý":
                sendMessage("bot", `✨ Mình rất mong nhận được góp ý từ bạn. Hãy gõ vào đây nhé!`);
                break;
            case "Tôi có câu hỏi khác":
                sendMessage("bot", `Tuyệt vời! Gõ câu hỏi bạn cần nhé.`);
                break;
            default:
                // const reply = getBestMatchingResponse(label, chatData);
                const reply =  await callGemini(label);
                sendMessage("bot", reply);
        }
    };

    const handleSendMessage = async () => {
        const text = inputValue.trim();
        setInputValue("")
        if (!text) return;
        await handleOptionClick(text);
        setInputValue("");
    };

    if (!isVisible) {
        return (
            <button className="reopen-button" onClick={() => setIsVisible(true)}>
            </button>
        );
    }

    return (
        <div className="chat-widget-container">
            <div className="chat-header">
                <span className="logo">💬 Kokoria</span>
                <button className="close-button" onClick={() => setIsVisible(false)}>✖</button>
            </div>

            <div className="chat-body">
                <div className="option-wrapper">
                    <button
                        className="toggle-options"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        {showOptions ? "▲ Ẩn tuỳ chọn" : "▼ Hiện tuỳ chọn"}
                    </button>

                    {showOptions && (
                        <div className="option-list">
                            {chatOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    className="chat-option"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <span className="emoji">{option.emoji}</span> {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="chat-log">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.type}`}>
                            <div className="chat-icon">{msg.type === "user" ? "🧑" : "🤖"}</div>
                            <div className="chat-text">
                                {msg.text.split("\n").map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="send-button" onClick={handleSendMessage}>➤</button>
            </div>
        </div>
    );
};

export default ChatWidget;
