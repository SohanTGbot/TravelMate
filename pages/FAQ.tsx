
import React from 'react';
import { useAppContext } from '../context/AppContext';

export const FAQ = () => {
  const { faqs } = useAppContext();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-800 dark:text-white mb-8 text-center font-display flex items-center justify-center gap-3">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Frequently Asked Questions
        </h1>
        <div className="space-y-4">
            {faqs.map((faq) => (
            <details key={faq.id} className="group bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-stone-900 dark:text-white">
                {faq.question}
                <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
                </summary>
                <div className="px-6 pb-6 text-stone-600 dark:text-stone-400">
                <p>{faq.answer}</p>
                </div>
            </details>
            ))}
        </div>
      </div>
    </div>
  );
};
