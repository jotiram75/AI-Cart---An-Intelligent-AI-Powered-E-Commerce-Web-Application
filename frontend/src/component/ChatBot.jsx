import React, { useState, useRef, useEffect } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoClose,
  IoSend,
  IoSparkles,
} from "react-icons/io5";
import { useChat } from "../context/ChatContext";

const ChatBot = () => {
  const { isOpen, mode, productContext, closeChat, toggleChat } = useChat();

  // We only reset messages when the mode or context changes significantly?
  // For now, let's keep messages local but maybe reset them if productContext id changes.
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Reset messages when opening a new product context
    if (isOpen && mode === "product") {
      setMessages([
        {
          role: "ai",
          text: `Hi! Ask me anything about this ${productContext?.name || "product"}.`,
        },
      ]);
    } else if (isOpen && mode === "global" && messages.length === 0) {
      setMessages([
        {
          role: "ai",
          text: "Hi! How can I help you with AICart today?",
        },
      ]);
    }
  }, [isOpen, mode, productContext?.name]); // Dependency on name to detect product switch

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            productContext: mode === "product" ? productContext : null,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, I'm having trouble connecting right now.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Network error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Global Trigger Button (Only visible if not open, or we can keep it as a toggle)
  // If Mode is product and open, we show the window.
  // If Mode is Global, we show the trigger.

  // Actually, simpler logic:
  // Always show the trigger button for Global Mode at bottom right.
  // If isOpen is true, show the window.
  // The context handles logic.

  if (!isOpen && mode === "product") return null; // Logic: Product Card triggers open it immediately. If closed, back to hidden.

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden flex flex-col w-[85vw] h-[60vh] sm:w-[350px] sm:h-[480px] animate-fade-in origin-bottom-right transition-all">
          {/* Header */}
          <div className="bg-gray-900 p-4 flex justify-between items-center text-white shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <IoSparkles className="text-primary" />
              <span className="font-bold tracking-wide text-sm sm:text-base">
                {mode === "product" ? "Product Assistant" : "AI Assistant"}
              </span>
            </div>
            <button
              onClick={closeChat}
              className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-white scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${
                                      msg.role === "user"
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-gray-100/80 text-gray-800 rounded-bl-none"
                                    }
                                `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input
              type="text"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-white p-2.5 rounded-xl hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <IoSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Global Trigger Button */}
      {(!isOpen || (isOpen && mode === "global")) && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 sm:w-18 sm:h-18 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-50"
        >
          {isOpen ? (
            <IoClose size={24} />
          ) : (
            <IoChatbubbleEllipsesOutline size={26} className="sm:w-8 sm:h-8" />
          )}
        </button>
      )}
    </div>
  );
};

export default ChatBot;
