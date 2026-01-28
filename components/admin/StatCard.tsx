import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'emerald' | 'blue' | 'purple' | 'orange' | 'pink';
    action?: {
        label: string;
        onClick: () => void;
    };
}

const colorClasses = {
    emerald: {
        bg: 'from-emerald-500/20 to-teal-500/20',
        border: 'border-emerald-500/30',
        icon: 'bg-emerald-500/20 text-emerald-400',
        trend: 'text-emerald-400',
        button: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
    },
    blue: {
        bg: 'from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-500/30',
        icon: 'bg-blue-500/20 text-blue-400',
        trend: 'text-blue-400',
        button: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
    },
    purple: {
        bg: 'from-purple-500/20 to-pink-500/20',
        border: 'border-purple-500/30',
        icon: 'bg-purple-500/20 text-purple-400',
        trend: 'text-purple-400',
        button: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
    },
    orange: {
        bg: 'from-orange-500/20 to-red-500/20',
        border: 'border-orange-500/30',
        icon: 'bg-orange-500/20 text-orange-400',
        trend: 'text-orange-400',
        button: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
    },
    pink: {
        bg: 'from-pink-500/20 to-rose-500/20',
        border: 'border-pink-500/30',
        icon: 'bg-pink-500/20 text-pink-400',
        trend: 'text-pink-400',
        button: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400'
    }
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color, action }) => {
    const colors = colorClasses[color];

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${color}-500/20`}>
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colors.icon}`}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : trend.value === 0 ? (
                                <Minus className="w-4 h-4 text-stone-400" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mb-2">
                    <h3 className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
                    <p className="text-sm text-stone-400 font-medium">{title}</p>
                </div>

                {/* Action Button */}
                {action && (
                    <button
                        onClick={action.onClick}
                        className={`mt-4 w-full py-2 px-4 rounded-lg ${colors.button} text-sm font-semibold transition-all duration-200`}
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
};
