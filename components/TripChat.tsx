
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { chatWithTripAssistant } from '../services/geminiService';

interface TripChatProps {
    onClose: () => void;
}

export const TripChat: React.FC<TripChatProps> = ({ onClose }) => {
    const { currentTripPlan, updateTripPlan, isGenerating } = useAppContext();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hi! I'm your travel assistant. Ask me anything or tell me to change your plan!" }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await chatWithTripAssistant(currentTripPlan, userMsg);

            // 1. Show the text reply
            if (response.assistantReply) {
                setMessages(prev => [...prev, { role: 'ai', text: response.assistantReply }]);
            }

            // 2. Update the plan if it was modified
            if (response.modifiedPlan) {
                updateTripPlan(response.modifiedPlan);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-sand-200 dark:border-charcoal-700 animate-slide-up z-50">
            {/* Header */}
            <div className="bg-forest-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                        <h3 className="font-bold text-sm">Trip Assistant</h3>
                        <p className="text-[10px] text-forest-200">Powered by Gemini</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50 dark:bg-charcoal-900/50 scrollbar-thin">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                            ? 'bg-forest-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-charcoal-700 text-charcoal-800 dark:text-sand-100 rounded-bl-none shadow-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-charcoal-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-charcoal-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-charcoal-800 border-t border-sand-200 dark:border-charcoal-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type a change..."
                        className="flex-1 bg-sand-100 dark:bg-charcoal-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-forest-500 outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};
