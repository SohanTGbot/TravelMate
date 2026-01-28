import React, { useState } from 'react';
import { X, Send, FileText } from 'lucide-react';

interface EmailComposerProps {
    isOpen: boolean;
    onClose: () => void;
    recipients: string[];
    onSend: (subject: string, message: string) => Promise<void>;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
    isOpen,
    onClose,
    recipients,
    onSend
}) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            alert('Please fill in both subject and message');
            return;
        }

        setSending(true);
        try {
            await onSend(subject, message);
            setSubject('');
            setMessage('');
            onClose();
        } catch (error) {
            alert('Failed to send email');
        } finally {
            setSending(false);
        }
    };

    const templates = [
        {
            name: 'Welcome Email',
            subject: 'Welcome to TravelMate! 🌍',
            message: 'Hi there!\n\nThank you for subscribing to our newsletter. We\'re excited to have you join our community of travel enthusiasts!\n\nStay tuned for exclusive travel tips, destination guides, and special offers.\n\nHappy travels!\nThe TravelMate Team'
        },
        {
            name: 'Special Offer',
            subject: '🎉 Exclusive Offer Just for You!',
            message: 'Hello!\n\nWe have a special offer exclusively for our newsletter subscribers!\n\n[Add your offer details here]\n\nDon\'t miss out on this amazing opportunity!\n\nBest regards,\nThe TravelMate Team'
        },
        {
            name: 'Newsletter Update',
            subject: '📰 This Month\'s Travel Newsletter',
            message: 'Dear Subscriber,\n\nHere\'s what\'s new this month:\n\n• [Highlight 1]\n• [Highlight 2]\n• [Highlight 3]\n\nRead more on our website!\n\nCheers,\nThe TravelMate Team'
        }
    ];

    const applyTemplate = (template: typeof templates[0]) => {
        setSubject(template.subject);
        setMessage(template.message);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-charcoal-900 rounded-2xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Compose Email</h2>
                        <p className="text-sm text-stone-400 mt-1">
                            Sending to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Templates */}
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-sm font-semibold text-stone-300 mb-3">Quick Templates</h3>
                    <div className="flex gap-2 flex-wrap">
                        {templates.map((template) => (
                            <button
                                key={template.name}
                                onClick={() => applyTemplate(template)}
                                className="flex items-center gap-2 px-3 py-2 bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 rounded-lg text-sm transition-all"
                            >
                                <FileText className="w-4 h-4" />
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject..."
                            className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-300 mb-2">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            rows={12}
                            className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Recipients Preview */}
                    <div className="bg-charcoal-800/50 border border-white/10 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-stone-300 mb-2">Recipients ({recipients.length})</h4>
                        <div className="max-h-32 overflow-y-auto admin-scrollbar">
                            <div className="flex flex-wrap gap-2">
                                {recipients.slice(0, 10).map((email, idx) => (
                                    <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                                        {email}
                                    </span>
                                ))}
                                {recipients.length > 10 && (
                                    <span className="text-xs text-stone-400 px-2 py-1">
                                        +{recipients.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending || !subject.trim() || !message.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Email
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
