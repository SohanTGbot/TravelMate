import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white dark:bg-charcoal-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-sand-200 dark:border-charcoal-700">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-charcoal-600 dark:text-sand-300 mb-6">
                            We're sorry, but an unexpected error occurred. Please try reloading the page.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                            >
                                Reload Page
                            </button>
                            <a
                                href="/"
                                className="block w-full text-emerald-600 dark:text-emerald-400 font-medium hover:underline text-sm"
                            >
                                Go back home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children as ReactNode;
    }
}
