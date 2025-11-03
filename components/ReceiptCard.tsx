import React, { useState, forwardRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Receipt, GeminiAnalysis } from '../types';
import { verifyReceiptWithGemini } from '../services/geminiService';

interface ReceiptCardProps {
    receipt: Receipt;
    onSwipe: (direction: string) => void;
    onCardLeftScreen: () => void;
}

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"></path>
    </svg>
);

// FIX: Define the imperative API for TinderCard to resolve the forwardRef type error, based on its usage in App.tsx.
interface TinderCardApi {
    swipe(dir: string): Promise<void>;
    restoreCard(): Promise<void>;
}

const ReceiptCard = forwardRef<TinderCardApi, ReceiptCardProps>(({ receipt, onSwipe, onCardLeftScreen }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSmartVerify = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await verifyReceiptWithGemini(receipt.receiptUrl);
            setAnalysis(result);
        } catch (err) {
            setError('Failed to analyze receipt. Please verify manually.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <TinderCard
            ref={ref}
            className="absolute"
            onSwipe={onSwipe}
            onCardLeftScreen={onCardLeftScreen}
            preventSwipe={['up', 'down']}
        >
            <div className="relative w-[350px] h-[550px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="w-full h-3/5 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={receipt.receiptUrl} alt="Receipt" className="w-full h-full object-contain" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{receipt.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{receipt.email}</p>
                    </div>

                    <div className="mt-2 text-sm">
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
                                <p className="text-blue-600 dark:text-blue-300">Analyzing with AI...</p>
                            </div>
                        )}
                        {error && (
                             <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
                                <p className="text-red-600 dark:text-red-300">{error}</p>
                            </div>
                        )}
                        {analysis && (
                            <div className={`p-3 rounded-lg ${analysis.isValid ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'}`}>
                                <p className={`font-bold ${analysis.isValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                    AI Suggestion: {analysis.isValid ? 'Looks Valid' : 'Needs Review'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{analysis.reason}</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSmartVerify} 
                        disabled={isLoading}
                        className="w-full mt-2 px-4 py-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Smart Verify</span>
                    </button>
                </div>
            </div>
        </TinderCard>
    );
});

export default ReceiptCard;