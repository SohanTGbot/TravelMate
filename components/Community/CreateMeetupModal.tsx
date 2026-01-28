import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateMeetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMeetupCreated?: () => void;
}

export const CreateMeetupModal: React.FC<CreateMeetupModalProps> = ({ isOpen, onClose, onMeetupCreated }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [maxTravelers, setMaxTravelers] = useState(5);
    const [creating, setCreating] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!title.trim() || !destination.trim() || !startDate || !endDate || !description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            alert('End date must be after start date');
            return;
        }

        try {
            setCreating(true);
            const { communityService } = await import('../../services/communityService');

            await communityService.createMeetup({
                title: title.trim(),
                destination: destination.trim(),
                start_date: startDate,
                end_date: endDate,
                description: description.trim(),
                max_travelers: maxTravelers,
            });

            // Reset form
            setTitle('');
            setDestination('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setMaxTravelers(5);

            onMeetupCreated?.();
            onClose();
            alert('✅ Meetup created successfully!');
        } catch (error) {
            console.error('Failed to create meetup:', error);
            alert('❌ Failed to create meetup');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-charcoal-900 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-charcoal-900 border-b border-sand-200 dark:border-charcoal-700 p-6 rounded-t-[2rem]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white font-display">
                            🤝 Create Meetup
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-sand-100 dark:bg-charcoal-800 flex items-center justify-center hover:bg-sand-200 dark:hover:bg-charcoal-700 transition-colors"
                        >
                            <span className="text-xl">×</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Meetup Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Backpacking through Europe"
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            maxLength={100}
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Destination *
                        </label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="e.g., Paris, France"
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            maxLength={100}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Max Travelers */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Max Travelers: {maxTravelers}
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={maxTravelers}
                            onChange={(e) => setMaxTravelers(parseInt(e.target.value))}
                            className="w-full h-2 bg-sand-200 dark:bg-charcoal-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-xs text-charcoal-500 dark:text-sand-500 mt-1">
                            <span>2</span>
                            <span>20</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-sand-200 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your travel plans, what you're looking for in travel buddies, etc."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-sand-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            maxLength={1000}
                        />
                        <div className="text-xs text-charcoal-500 dark:text-sand-400 mt-1 text-right">
                            {description.length}/1000
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 text-charcoal-700 dark:text-sand-200 font-semibold hover:bg-sand-100 dark:hover:bg-charcoal-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={creating || !title.trim() || !destination.trim() || !startDate || !endDate || !description.trim()}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating ? 'Creating...' : 'Create Meetup'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
