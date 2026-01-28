import React from 'react';

interface VisualQuizProps {
    onSelect: (vibe: string) => void;
    selectedVibe?: string;
}

const QUIZ_OPTIONS = [
    { id: 'relaxing', label: 'Relaxing Beach', icon: '🏖️', bg: 'bg-blue-100 text-blue-800' },
    { id: 'adventure', label: 'Mountain Adventure', icon: '⛰️', bg: 'bg-green-100 text-green-800' },
    { id: 'culture', label: 'Cultural City', icon: '🏛️', bg: 'bg-amber-100 text-amber-800' },
    { id: 'foodie', label: 'Food Exploration', icon: '🍜', bg: 'bg-orange-100 text-orange-800' },
    { id: 'nightlife', label: 'Nightlife & Party', icon: '🎉', bg: 'bg-purple-100 text-purple-800' },
    { id: 'romantic', label: 'Romantic Getaway', icon: '🌹', bg: 'bg-pink-100 text-pink-800' },
];

export const VisualQuiz: React.FC<VisualQuizProps> = ({ onSelect, selectedVibe }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                <span className="text-xl">🎨</span> What's your vibe?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {QUIZ_OPTIONS.map((opt) => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSelect(opt.label)}
                        className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 border-2 ${selectedVibe === opt.label
                                ? 'border-forest-500 bg-white dark:bg-charcoal-800 shadow-xl scale-105'
                                : 'border-transparent bg-sand-50 dark:bg-charcoal-800/50 hover:bg-sand-100 dark:hover:bg-charcoal-700'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${opt.bg}`}>
                            {opt.icon}
                        </div>
                        <span className="font-bold text-charcoal-800 dark:text-sand-100">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
