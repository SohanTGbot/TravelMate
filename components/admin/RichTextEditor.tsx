import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Eye, Save, Upload, Loader, CheckCircle } from 'lucide-react';

interface RichTextEditorProps {
    initialValue: string;
    onSave: (content: string) => Promise<void>;
    onImageUpload?: (file: File) => Promise<string>;
    autoSave?: boolean;
    autoSaveInterval?: number; // in milliseconds
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    initialValue,
    onSave,
    onImageUpload,
    autoSave = false,
    autoSaveInterval = 30000, // 30 seconds
    placeholder = 'Start writing...'
}) => {
    const [content, setContent] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const quillRef = useRef<ReactQuill>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setContent(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (content !== initialValue) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [content, initialValue]);

    // Auto-save effect
    useEffect(() => {
        if (autoSave && hasChanges) {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }

            autoSaveTimerRef.current = setTimeout(() => {
                handleSave();
            }, autoSaveInterval);
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [content, autoSave, hasChanges]);

    const handleSave = async () => {
        if (!hasChanges) return;

        setIsSaving(true);
        try {
            await onSave(content);
            setLastSaved(new Date());
            setHasChanges(false);
        } catch (error) {
            alert('Failed to save content');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file || !onImageUpload) return;

            try {
                const url = await onImageUpload(file);
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection();
                    quill.insertEmbed(range?.index || 0, 'image', url);
                }
            } catch (error) {
                alert('Failed to upload image');
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['blockquote', 'code-block'],
                ['clean']
            ],
            handlers: {
                image: onImageUpload ? handleImageUpload : undefined
            }
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'color', 'background',
        'align',
        'link', 'image', 'video',
        'blockquote', 'code-block'
    ];

    const formatLastSaved = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return date.toLocaleTimeString();
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-charcoal-800 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${showPreview
                                ? 'bg-emerald-500 text-white'
                                : 'bg-charcoal-700 hover:bg-charcoal-600 text-stone-300'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>

                    {autoSave && (
                        <div className="flex items-center gap-2 text-sm text-stone-400">
                            {isSaving ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : lastSaved ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    Saved {formatLastSaved(lastSaved)}
                                </>
                            ) : hasChanges ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    Unsaved changes
                                </>
                            ) : null}
                        </div>
                    )}
                </div>

                {!autoSave && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Editor / Preview */}
            <div className="bg-charcoal-900 border border-white/10 rounded-lg overflow-hidden">
                {showPreview ? (
                    <div
                        className="prose prose-invert max-w-none p-6"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <div className="rich-text-editor">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            placeholder={placeholder}
                        />
                    </div>
                )}
            </div>

            {/* Character Count */}
            <div className="text-sm text-stone-400 text-right">
                {content.replace(/<[^>]*>/g, '').length} characters
            </div>
        </div>
    );
};

// Custom styles for Quill editor (add to your CSS)
export const quillStyles = `
.rich-text-editor .ql-toolbar {
    background: #1F2937;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rich-text-editor .ql-container {
    background: #111827;
    border: none;
    color: white;
    font-size: 16px;
    min-height: 400px;
}

.rich-text-editor .ql-editor {
    min-height: 400px;
}

.rich-text-editor .ql-editor.ql-blank::before {
    color: #9CA3AF;
    font-style: normal;
}

.rich-text-editor .ql-stroke {
    stroke: #9CA3AF;
}

.rich-text-editor .ql-fill {
    fill: #9CA3AF;
}

.rich-text-editor .ql-picker-label {
    color: #9CA3AF;
}

.rich-text-editor .ql-picker-options {
    background: #1F2937;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.rich-text-editor .ql-picker-item:hover {
    background: #374151;
}

.rich-text-editor .ql-toolbar button:hover,
.rich-text-editor .ql-toolbar button.ql-active {
    color: #10B981;
}

.rich-text-editor .ql-toolbar button:hover .ql-stroke,
.rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
    stroke: #10B981;
}

.rich-text-editor .ql-toolbar button:hover .ql-fill,
.rich-text-editor .ql-toolbar button.ql-active .ql-fill {
    fill: #10B981;
}

/* Prose styling for preview */
.prose-invert {
    color: #E5E7EB;
}

.prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 {
    color: white;
    font-weight: bold;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}

.prose-invert h1 { font-size: 2em; }
.prose-invert h2 { font-size: 1.5em; }
.prose-invert h3 { font-size: 1.25em; }

.prose-invert p {
    margin-bottom: 1em;
    line-height: 1.7;
}

.prose-invert a {
    color: #10B981;
    text-decoration: underline;
}

.prose-invert ul, .prose-invert ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
}

.prose-invert li {
    margin-bottom: 0.5em;
}

.prose-invert blockquote {
    border-left: 4px solid #10B981;
    padding-left: 1em;
    margin: 1em 0;
    font-style: italic;
    color: #9CA3AF;
}

.prose-invert code {
    background: #1F2937;
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
    font-family: monospace;
}

.prose-invert pre {
    background: #1F2937;
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin: 1em 0;
}

.prose-invert img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5em;
    margin: 1em 0;
}
`;
