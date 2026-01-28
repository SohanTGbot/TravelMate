import React, { useState } from 'react';
import { Button } from '../Button';

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

interface FAQFormProps {
    initialData?: FAQ | null;
    onSubmit: (data: Omit<FAQ, 'id'>) => void;
    onCancel: () => void;
}

export const FAQForm: React.FC<FAQFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [question, setQuestion] = useState(initialData?.question || '');
    const [answer, setAnswer] = useState(initialData?.answer || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ question, answer });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-charcoal-900 rounded-xl p-6 max-w-2xl w-full border border-white/10">
                <h3 className="text-2xl font-bold mb-6">{initialData ? 'Edit FAQ' : 'Create FAQ'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Answer</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={6}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700">
                            Cancel
                        </button>
                        <Button type="submit">
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface Destination {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface DestinationFormProps {
    initialData?: Destination | null;
    onSubmit: (data: Omit<Destination, 'id'>) => void;
    onCancel: () => void;
}

export const DestinationForm: React.FC<DestinationFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [image, setImage] = useState(initialData?.image || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, image });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-charcoal-900 rounded-xl p-6 max-w-2xl w-full border border-white/10">
                <h3 className="text-2xl font-bold mb-6">{initialData ? 'Edit Destination' : 'Create Destination'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Image URL</label>
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700">
                            Cancel
                        </button>
                        <Button type="submit">
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface ServiceFormProps {
    initialData?: Service | null;
    onSubmit: (data: Omit<Service, 'id'>) => void;
    onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [icon, setIcon] = useState(initialData?.icon || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, icon });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-charcoal-900 rounded-xl p-6 max-w-2xl w-full border border-white/10">
                <h3 className="text-2xl font-bold mb-6">{initialData ? 'Edit Service' : 'Create Service'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                        <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full bg-charcoal-950 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                            placeholder="🗺️"
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700">
                            Cancel
                        </button>
                        <Button type="submit">
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
