import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFound = () => {
    return (
        <div className="min-h-screen bg-sand-50 dark:bg-charcoal-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full">
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-charcoal-600 dark:text-sand-300 mb-8 text-lg">
                    Oops! The adventure you're looking for seems to have gone off the map.
                </p>
                <Link to="/">
                    <Button variant="primary" size="lg" className="mx-auto shadow-xl shadow-emerald-500/20">
                        Return to Base Cache
                    </Button>
                </Link>
            </div>
        </div>
    );
};
