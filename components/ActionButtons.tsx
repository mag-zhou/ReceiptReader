
import React from 'react';

interface ActionButtonsProps {
    onReject: () => void;
    onApprove: () => void;
}

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const ActionButtons: React.FC<ActionButtonsProps> = ({ onReject, onApprove }) => {
    return (
        <div className="flex items-center justify-center space-x-8 mt-6">
            <button onClick={onReject} className="flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-700 text-red-500 shadow-xl transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                <XIcon className="w-10 h-10" />
            </button>
            <button onClick={onApprove} className="flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-700 text-green-500 shadow-xl transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                <CheckIcon className="w-10 h-10" />
            </button>
        </div>
    );
};

export default ActionButtons;
   