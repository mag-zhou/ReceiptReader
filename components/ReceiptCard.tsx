import React, { useState, useEffect } from 'react';
import { Receipt } from '../types';

interface ReceiptCardProps {
    receipt: Receipt;
}

const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M12,18H8V16H12V18M14,14H8V12H14V14M13,9V3.5L18.5,9H13Z" />
    </svg>
);

const ImageErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
    const [imageError, setImageError] = useState(false);
    const isPdf = receipt.receiptUrl.toLowerCase().split('?')[0].endsWith('.pdf');

    // Reset image error state when the receipt URL changes.
    useEffect(() => {
        setImageError(false);
    }, [receipt.receiptUrl]);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="relative w-[350px] h-[550px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="w-full h-4/5 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                {isPdf ? (
                     <div className="text-center p-4 flex flex-col items-center justify-center h-full">
                        <FileTextIcon className="w-20 h-20 text-red-500" />
                        <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300">PDF Receipt</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Preview not available.</p>
                        <a 
                            href={receipt.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-4 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            View in New Tab
                        </a>
                    </div>
                ) : imageError ? (
                    <div className="text-center p-4 flex flex-col items-center justify-center h-full text-red-500">
                        <ImageErrorIcon className="w-20 h-20" />
                        <p className="mt-4 font-semibold">Image Failed to Load</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">The URL might be incorrect or unreachable.</p>
                    </div>
                ) : (
                    <img 
                        src={receipt.receiptUrl} 
                        alt="Receipt" 
                        className="w-full h-full object-contain"
                        onError={handleImageError} 
                    />
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col justify-center border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{receipt.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{receipt.email}</p>
            </div>
        </div>
    );
};

export default ReceiptCard;