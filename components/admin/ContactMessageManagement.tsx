import React, { useState } from 'react';
import { Search, X, MessageSquare, Flag, Eye, EyeOff, Send, Clock } from 'lucide-react';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    read?: boolean;
    priority?: 'low' | 'medium' | 'high';
    reply?: string;
}

interface ContactMessageManagementProps {
    messages: ContactMessage[];
    onToggleRead: (id: string, read: boolean) => Promise<void>;
    onSetPriority: (id: string, priority: 'low' | 'medium' | 'high') => Promise<void>;
    onSendReply: (id: string, reply: string) => Promise<void>;
}

export const MessageSearch: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search messages by name, email, or content..."
                className="w-full pl-10 pr-10 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {query && (
                <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

interface PriorityBadgeProps {
    priority: 'low' | 'medium' | 'high';
    onSetPriority: (priority: 'low' | 'medium' | 'high') => void;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, onSetPriority }) => {
    const colors = {
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
        <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-stone-400" />
            <select
                value={priority}
                onChange={(e) => onSetPriority(e.target.value as 'low' | 'medium' | 'high')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${colors[priority]} bg-charcoal-800 hover:opacity-80`}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
    );
};

interface ReadToggleProps {
    isRead: boolean;
    onToggle: () => void;
}

export const ReadToggle: React.FC<ReadToggleProps> = ({ isRead, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${isRead
                    ? 'bg-stone-500/20 text-stone-400 hover:bg-stone-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                }`}
            title={isRead ? 'Mark as unread' : 'Mark as read'}
        >
            {isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isRead ? 'Read' : 'Unread'}
        </button>
    );
};

interface QuickReplyProps {
    messageId: string;
    recipientEmail: string;
    recipientName: string;
    onSend: (messageId: string, reply: string) => Promise<void>;
}

export const QuickReply: React.FC<QuickReplyProps> = ({ messageId, recipientEmail, recipientName, onSend }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    const templates = [
        {
            name: 'Thank You',
            content: `Hi ${recipientName},\n\nThank you for reaching out to us! We've received your message and will get back to you shortly.\n\nBest regards,\nTravelMate Team`
        },
        {
            name: 'More Info Needed',
            content: `Hi ${recipientName},\n\nThank you for your message. To better assist you, could you please provide more details about [specific information needed]?\n\nBest regards,\nTravelMate Team`
        },
        {
            name: 'Issue Resolved',
            content: `Hi ${recipientName},\n\nWe're glad to inform you that your inquiry has been resolved. If you have any further questions, please don't hesitate to reach out.\n\nBest regards,\nTravelMate Team`
        }
    ];

    const handleSend = async () => {
        if (!reply.trim()) {
            alert('Please enter a reply message');
            return;
        }

        setSending(true);
        try {
            await onSend(messageId, reply);
            setReply('');
            setIsOpen(false);
            alert('Reply sent successfully!');
        } catch (error) {
            alert('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-semibold transition-all"
            >
                <MessageSquare className="w-4 h-4" />
                Quick Reply
            </button>
        );
    }

    return (
        <div className="mt-4 p-4 bg-charcoal-800/50 rounded-lg border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">Reply to {recipientName}</h4>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-stone-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Templates */}
            <div className="flex gap-2 flex-wrap">
                {templates.map((template) => (
                    <button
                        key={template.name}
                        onClick={() => setReply(template.content)}
                        className="px-2 py-1 bg-charcoal-700 hover:bg-charcoal-600 border border-white/10 rounded text-xs transition-all"
                    >
                        {template.name}
                    </button>
                ))}
            </div>

            {/* Reply Input */}
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="w-full bg-charcoal-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm"
            />

            {/* Send Button */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg text-sm transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSend}
                    disabled={sending || !reply.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {sending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Reply
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export const MessageFilters: React.FC<{
    currentFilter: 'all' | 'unread' | 'high' | 'medium' | 'low';
    onFilterChange: (filter: 'all' | 'unread' | 'high' | 'medium' | 'low') => void;
    counts: {
        all: number;
        unread: number;
        high: number;
        medium: number;
        low: number;
    };
}> = ({ currentFilter, onFilterChange, counts }) => {
    const filters = [
        { value: 'all', label: 'All', count: counts.all },
        { value: 'unread', label: 'Unread', count: counts.unread },
        { value: 'high', label: 'High Priority', count: counts.high },
        { value: 'medium', label: 'Medium Priority', count: counts.medium },
        { value: 'low', label: 'Low Priority', count: counts.low }
    ] as const;

    return (
        <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentFilter === filter.value
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                            : 'bg-charcoal-800 text-stone-300 hover:bg-charcoal-700'
                        }`}
                >
                    {filter.label}
                    {filter.count > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {filter.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
