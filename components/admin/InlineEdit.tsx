import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Loader } from 'lucide-react';

interface InlineEditProps {
    value: string;
    onSave: (newValue: string) => Promise<void>;
    type?: 'text' | 'textarea' | 'email' | 'url';
    placeholder?: string;
    validate?: (value: string) => string | null; // Returns error message or null
    className?: string;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
    value,
    onSave,
    type = 'text',
    placeholder = 'Click to edit...',
    validate,
    className = ''
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleSave = async () => {
        // Validate
        if (validate) {
            const validationError = validate(editValue);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        // Check if value changed
        if (editValue === value) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await onSave(editValue);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setError(null);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'textarea') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (!isEditing) {
        return (
            <div
                onClick={() => setIsEditing(true)}
                className={`group cursor-pointer hover:bg-charcoal-800/50 rounded px-2 py-1 transition-all ${className}`}
            >
                <div className="flex items-center gap-2">
                    <span className={value ? 'text-white' : 'text-stone-500'}>
                        {value || placeholder}
                    </span>
                    <Edit2 className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {type === 'textarea' ? (
                <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus
                    rows={4}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
            ) : (
                <input
                    type={type}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus
                    className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
            )}

            {error && (
                <div className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Save
                        </>
                    )}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1 bg-charcoal-700 hover:bg-charcoal-600 text-white rounded-lg text-sm transition-all disabled:opacity-50"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </div>
    );
};

interface InlineSelectProps {
    value: string;
    options: Array<{ value: string; label: string }>;
    onSave: (newValue: string) => Promise<void>;
    className?: string;
}

export const InlineSelect: React.FC<InlineSelectProps> = ({
    value,
    options,
    onSave,
    className = ''
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleSave = async () => {
        if (editValue === value) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(editValue);
            setIsEditing(false);
        } catch (err) {
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const currentOption = options.find(opt => opt.value === value);

    if (!isEditing) {
        return (
            <div
                onClick={() => setIsEditing(true)}
                className={`group cursor-pointer hover:bg-charcoal-800/50 rounded px-2 py-1 transition-all ${className}`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-white">{currentOption?.label || value}</span>
                    <Edit2 className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                className="w-full bg-charcoal-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Save
                        </>
                    )}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1 bg-charcoal-700 hover:bg-charcoal-600 text-white rounded-lg text-sm transition-all disabled:opacity-50"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </div>
    );
};

// Validation helpers
export const validators = {
    required: (value: string) => {
        return value.trim() ? null : 'This field is required';
    },
    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Invalid email address';
    },
    url: (value: string) => {
        try {
            new URL(value);
            return null;
        } catch {
            return 'Invalid URL';
        }
    },
    minLength: (min: number) => (value: string) => {
        return value.length >= min ? null : `Minimum ${min} characters required`;
    },
    maxLength: (max: number) => (value: string) => {
        return value.length <= max ? null : `Maximum ${max} characters allowed`;
    },
    combine: (...validators: Array<(value: string) => string | null>) => (value: string) => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) return error;
        }
        return null;
    }
};
