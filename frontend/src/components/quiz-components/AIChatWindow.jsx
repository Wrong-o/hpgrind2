import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const AIChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const newMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // TODO: Integrate with actual AI backend
        // Placeholder AI response
        setTimeout(() => {
            const aiResponse = {
                text: "This is a placeholder AI response. Backend integration needed.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg h-[500px] w-[400px]">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                <h3 className="text-lg font-semibold">AI Assistant</h3>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <p>{message.text}</p>
                            <span className="text-xs opacity-75 block mt-1">
                                {message.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChatWindow; 