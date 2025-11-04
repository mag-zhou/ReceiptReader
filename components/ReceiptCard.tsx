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

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);


const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
    const hasUrl = receipt && receipt.receiptUrl && typeof receipt.receiptUrl === 'string' && receipt.receiptUrl.trim() !== '';
    
    const handleViewReceipt = () => {
        if (hasUrl) {
            const width = 800;
            const height = 600;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);
            const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,noopener,noreferrer`;
            window.open(receipt.receiptUrl, 'receiptWindow', features);
        }
    };

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
            <div className="text-center p-4 flex flex-col items-center justify-center h-full">
                 <svg className="w-20 h-20 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <button 
                    onClick={handleViewReceipt}
                    className="w-full max-w-[200px] inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                >
                    <ExternalLinkIcon className="w-5 h-5 mr-2" />
                    View Receipt
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">(Opens in a new window)</p>
            </div>
        );
    }

    return (
        <div className="relative w-[350px] h-[550px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="w-full h-4/5 bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center overflow-hidden">
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