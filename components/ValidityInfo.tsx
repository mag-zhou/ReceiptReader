import React, { useState } from 'react';

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    // FIX: Corrected a typo in the `viewBox` attribute. It had an extra quote (`viewBox="0 0 24" 24"`) which broke JSX parsing.
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const ValidityInfo: React.FC = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div 
            className="relative flex items-center"
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
        >
            <button
                onClick={() => setIsTooltipVisible(!isTooltipVisible)} // For touch devices
                aria-label="Show receipt validity criteria"
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
                <InfoIcon className="w-6 h-6" />
            </button>
            {isTooltipVisible && (
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 bg-slate-900/95 text-white text-sm rounded-lg shadow-lg z-10"
                    role="tooltip"
                >
                    <h4 className="font-bold mb-2 text-white">Valid Receipt Criteria:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Proof of payment, with amount paid (Last 4 digits of card or Paypal, NOTHING ELSE)</li>
                        <li>Dates of travel</li>
                        <li>Destination of travel</li>
                        <li>Full legal name of traveler</li>
                        <li>Class of service (must be Economy/Coach/equivalent)</li>
                    </ul>
                    {/* FIX: Corrected arrow positioning. It now uses `top-full` to correctly position itself below the tooltip bubble, making the whole component render as expected. */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-900/95"></div>
                </div>
            )}
        </div>
    );
};

export default ValidityInfo;