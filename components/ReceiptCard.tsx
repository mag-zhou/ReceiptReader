import React from 'react';
import { Receipt } from '../types';

interface ReceiptCardProps {
    receipt: Receipt;
}

const LinkOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);


const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
    const hasUrl = receipt && receipt.receiptUrl && typeof receipt.receiptUrl === 'string' && receipt.receiptUrl.trim() !== '';

    const renderContent = () => {
        if (!hasUrl) {
            return (
                <div className="text-center p-4 flex flex-col items-center justify-center h-full text-amber-500">
                    <LinkOffIcon className="w-20 h-20" />
                    <p className="mt-4 font-semibold">Receipt URL Missing</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Check the uploaded CSV file.</p>
                </div>
            )
        }
        
        return (
            <iframe
                src={receipt.receiptUrl}
                title="Receipt PDF Preview"
                className="w-full h-full"
            />
        );
    }

    return (
        <div className="relative w-[350px] h-[550px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="w-full h-4/5 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                {renderContent()}
            </div>
            <div className="p-4 flex-grow flex flex-col justify-center border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{receipt.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{receipt.email}</p>
            </div>
        </div>
    );
};

export default ReceiptCard;