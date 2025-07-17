import React, { useState, useContext } from "react";
import "./ChatWidget.css";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { getBestMatchingResponse } from "../../utils/chatMatcher";
import chatData from "./chatData.json";

const chatOptions = [
    { emoji: "🍽️", label: "What's on your menu?" },
    { emoji: "🔔", label: "I'd like to reserve a table" },
    { emoji: "📅", label: "I want to view my reservation" },
    { emoji: "📞", label: "How can I contact you?" },
    { emoji: "📩", label: "I'd like to leave feedback" },
    { emoji: "🔍", label: "I have another question" }
];

const ChatWidget = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { type: "bot", text: "👋 Hi there! How can I help you?" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const { url, token } = useContext(StoreContext);

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
                params: {},
                headers: { token },
            });

            const data = response?.data?.data || [];
            if (data.length === 0) return "There are no upcoming reservations.";

            let message = "\n📋 **Reservation List**\n\n";
            for (let reservation of data) {
                const date = reservation.date || "No time specified";
                const branch = reservation.branch || "No branch";
                const guests = reservation.guests || "N/A";
                const status = reservation.status || "pending";
                const statusIcon = getStatusIcon(status);

                message += `───────────────\n`;
                message += `🕒 Datetime: ${date}\n`;
                message += `📍 Branch: ${branch}\n`;
                message += `👥 Guests: ${guests}\n`;
                message += `📌 Status: ${statusIcon} ${status}\n\n`;
            }

            message += `───────────────\n**Total: ${data.length} reservation(s)**`;
            return message;
        } catch (error) {
            console.error("Failed to fetch reservation list:", error);
            return "❌ Error fetching the reservation list. Please try again later.";
        }
    };

    const handleOptionClick = async (optionOrText) => {
        const isString = typeof optionOrText === "string";
        const label = isString ? optionOrText : optionOrText.label;

        sendMessage("user", label);

        switch (label) {
            case "What's on your menu?":
                sendMessage("bot", `Here's a quick look at our menu categories:
• Chicken 🍗  
• K-Food 🇰🇷  
• Tteokbokki 🌶️  
• Bibimbap 🥣  
• Sides 🍟  
• Desserts 🍰
👉 Full menu: https://kokoria.vercel.app`);
                break;
            case "I'd like to reserve a table":
                sendMessage("bot", `🔔 Great choice! I'm taking you to our reservation page...`);
                setTimeout(() => navigate("/reservation"), 600);
                break;
            case "I want to view my reservation":
                const msg = await getListReservation();
                sendMessage("bot", msg);
                break;
            case "How can I contact you?":
                sendMessage("bot", `📞 You can reach us at: **070.879.6719** or just message us here!`);
                break;
            case "I'd like to leave feedback":
                sendMessage("bot", `✨ We’d love your feedback! Just type it here and we’ll take it from there.`);
                break;
            case "I have another question":
                sendMessage("bot", `Sure! Please type your question and I’ll assist you as best I can.`);
                break;
            default:
                const reply = getBestMatchingResponse(label, chatData);
                sendMessage("bot", reply);
        }
    };

    const handleSendMessage = async () => {
        const text = inputValue.trim();
        if (!text) return;
        await handleOptionClick(text);
        setInputValue("");
    };

    return (
        <div className="chat-widget-container">
            <div className="chat-header">
                <span className="logo">Kokoria</span>
            </div>

            <div className="chat-body">
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

                <div className="chat-log">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.type === "user" ? "user" : "bot"}`}>
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
                    placeholder="Send a message..."
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
