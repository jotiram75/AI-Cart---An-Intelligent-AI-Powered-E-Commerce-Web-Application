import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("global"); // 'global' or 'product'
    const [productContext, setProductContext] = useState(null);

    const openChat = (newMode = "global", productData = null) => {
        setMode(newMode);
        setProductContext(productData);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setMode("global");
        setProductContext(null);
    };

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <ChatContext.Provider value={{ isOpen, mode, productContext, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};
