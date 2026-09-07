import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/chatbot.css";

function Chatbot() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! 👋 I'm MediFlow Assistant. How can I help you today?"
        }
    ]);

    /* =====================================================
       AUTO SCROLL
       ===================================================== */
useEffect(() => {
    if (!isOpen) {
        return;
    }

    if (messages.length > 1 || isLoading) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }, 50);
    }
}, [messages, isOpen, isLoading]);

    /* =====================================================
       FORMAT AI RESPONSE
       ===================================================== */

    const renderMessage = (content) => {
        const lines = content.split("\n");

        return lines.map((line, lineIndex) => {
            // Remove Markdown bullet at beginning
            let cleanLine = line.replace(
                /^\s*[-*]\s+/,
                ""
            );

            if (!cleanLine.trim()) {
                return (
                    <div
                        key={lineIndex}
                        className="message-line-space"
                    />
                );
            }

            // Split bold text and Markdown links
            const parts = cleanLine.split(
                /(\*\*.*?\*\*|\[.*?\]\(.*?\))/
            );

            return (
                <div
                    key={lineIndex}
                    className="message-line"
                >
                    {parts.map((part, index) => {
                        // Bold text
                        if (
                            part.startsWith("**") &&
                            part.endsWith("**")
                        ) {
                            return (
                                <strong key={index}>
                                    {part.slice(2, -2)}
                                </strong>
                            );
                        }

                        // Markdown link
                        const linkMatch = part.match(
                            /^\[(.*?)\]\((.*?)\)$/
                        );

                        if (linkMatch) {
                            const [, text, path] =
                                linkMatch;

                            return (
                                <button
                                    key={index}
                                    className="chat-action-button"
                                    onClick={() =>
                                        navigate(path)
                                    }
                                >
                                    {text}
                                </button>
                            );
                        }

                        return (
                            <span key={index}>
                                {part}
                            </span>
                        );
                    })}
                </div>
            );
        });
    };


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    const sendMessage = async (messageText = input) => {
        const text = messageText.trim();

        if (!text || isLoading) {
            return;
        }

        const userMessage = {
            role: "user",
            content: text
        };

        setMessages((prev) => [
            ...prev,
            userMessage
        ]);

        setInput("");
        setIsLoading(true);

        try {
            const history = messages
                .filter(
                    (message) =>
                        message.role === "user" ||
                        message.role === "assistant"
                )
                .slice(-10)
                .map((message) => ({
                    role: message.role,
                    content: message.content
                }));

            const response = await api.post("/chat", {
                message: text,
                history
            });

            if (response.data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            response.data.message
                    }
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Sorry, I couldn't process your request right now. Please try again."
                    }
                ]);
            }
        } catch (error) {
            console.error(
                "Chatbot error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I'm having trouble connecting right now. Please try again."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    /* =====================================================
       QUICK ACTIONS
       ===================================================== */

    const handleQuickAction = (action) => {
        if (action === "Book Appointment") {
            navigate("/book-appointment");
            return;
        }

        if (action === "Find Doctor") {
            navigate("/doctors");
            return;
        }

        if (action === "Medical Reports") {
            navigate("/medical-reports");
            return;
        }
    };


    /* =====================================================
       ENTER KEY
       ===================================================== */

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };


    /* =====================================================
       UI
       ===================================================== */

    return (
        <>
            {!isOpen && (
                <button
                    className="chatbot-floating-button"
                    onClick={() =>
                        setIsOpen(true)
                    }
                    aria-label="Open MediFlow Assistant"
                >
                    💬
                </button>
            )}

            {isOpen && (
                <div className="chatbot-container">

                    {/* ================= HEADER ================= */}

                    <div className="chatbot-header">

                        <div className="chatbot-header-info">

                            <div className="chatbot-avatar">
                                🤖
                            </div>

                            <div>
                                <h3>
                                    MediFlow Assistant
                                </h3>

                                <span className="chatbot-status">
                                    <span className="status-dot"></span>
                                    Online
                                </span>
                            </div>

                        </div>

                        <button
                            className="chatbot-close"
                            onClick={() =>
                                setIsOpen(false)
                            }
                            aria-label="Close chatbot"
                        >
                            ✕
                        </button>

                    </div>


                    {/* ================= MESSAGES ================= */}

                    <div className="chatbot-messages">

                        {messages.map(
                            (message, index) => (
                                <div
                                    key={index}
                                    className={`chatbot-message ${
                                        message.role ===
                                        "user"
                                            ? "user-message"
                                            : "bot-message"
                                    }`}
                                >

                                    {message.role ===
                                        "assistant" && (
                                        <div className="message-avatar">
                                            🤖
                                        </div>
                                    )}

                                    <div className="message-content">
                                        {renderMessage(
                                            message.content
                                        )}
                                    </div>

                                </div>
                            )
                        )}


                        {/* Typing indicator */}

                        {isLoading && (
                            <div className="chatbot-message bot-message">

                                <div className="message-avatar">
                                    🤖
                                </div>

                                <div className="message-content typing">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                            </div>
                        )}

                        {/* Auto-scroll target */}

                        <div ref={messagesEndRef}></div>

                    </div>


                    {/* ================= QUICK ACTIONS ================= */}

                    <div className="chatbot-quick-actions">

                        <button
                            onClick={() =>
                                handleQuickAction(
                                    "Book Appointment"
                                )
                            }
                        >
                            📅 Book Appointment
                        </button>

                        <button
                            onClick={() =>
                                handleQuickAction(
                                    "Find Doctor"
                                )
                            }
                        >
                            🩺 Find Doctor
                        </button>

                        <button
                            onClick={() =>
                                handleQuickAction(
                                    "Medical Reports"
                                )
                            }
                        >
                            📋 Medical Reports
                        </button>

                    </div>


                    {/* ================= INPUT ================= */}

                    <div className="chatbot-input-area">

                        <input
                            type="text"
                            placeholder="Ask MediFlow Assistant..."
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />

                        <button
                            onClick={() =>
                                sendMessage()
                            }
                            disabled={
                                isLoading ||
                                !input.trim()
                            }
                            aria-label="Send message"
                        >
                            {isLoading
                                ? "..."
                                : "➤"}
                        </button>

                    </div>


                    {/* ================= DISCLAIMER ================= */}

                    <div className="chatbot-disclaimer">
                        MediFlow Assistant provides
                        general information and is not
                        a substitute for professional
                        medical advice.
                    </div>

                </div>
            )}
        </>
    );
}

export default Chatbot;