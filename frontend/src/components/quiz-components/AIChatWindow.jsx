import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import 'katex/dist/katex.min.css';

const AIChatWindow = ({ Question }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const systemPrompt = {
        role: "system",
        content: `Svara kort: Modellen kommer hjälpa elever med matte problem. Modeller kommer känna till frågan och svaret redan när eleven börjar interagera med modellen. Korta, svar, svara bara på frågan och undvik svåra ord. Modellen ska inte ge svaret, utan hjälpa eleven på vägen. Frågan är:${Question}.`
    };

    // Function to render text with LaTeX
    const renderWithLatex = (text) => {
        if (!text) return null;
        
        // Split by LaTeX delimiters
        const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
        
        return parts.map((part, index) => {
            // Block math: $$...$$
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2);
                return <BlockMath key={index} math={math} />;
            }
            // Inline math: $...$
            else if (part.startsWith('$') && part.endsWith('$')) {
                const math = part.slice(1, -1);
                return <InlineMath key={index} math={math} />;
            }
            // Regular text
            else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to local state
        const newUserMessage = {
            sender: 'user',
            text: inputMessage,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages([...messages, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Prepare messages for the API in the correct format
        const messagesToSend = [
            systemPrompt,
            ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            {
                role: 'user',
                content: inputMessage
            }
        ];

        console.log(messagesToSend);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat_bot/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ messages: messagesToSend })
            });

            if (!response.ok) {
                throw new Error(`Failed to get AI response: ${response.status}`);
            }

            const data = await response.json();
            
            const aiResponse = {
                text: data.message,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            };
            
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorResponse = {
                text: 'Sorry, I encountered an error. Please try again later.',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
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
                            <div>{renderWithLatex(message.text)}</div>
                            <span className="text-xs opacity-75 block mt-1">
                                {message.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                            <p>Typing...</p>
                        </div>
                    </div>
                )}
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
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg px-4 py-2 transition-colors`}
                        disabled={isLoading}
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AIChatWindow; 