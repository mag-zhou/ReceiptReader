
// FIX: Correctly import useState from React. The previous import was syntactically incorrect and caused downstream errors.
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Receipt, ReceiptStatus } from './types';
import FileUpload from './components/FileUpload';
import ActionButtons from './components/ActionButtons';
import ReceiptCard from './components/ReceiptCard';

const App: React.FC = () => {
  // FIX: Use the `useState` hook from React. `aistudio.useState` is not a valid function.
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<'approved' | 'rejected' | null>(null);

  const handleDecision = (status: ReceiptStatus) => {
    if (currentIndex >= receipts.length) return;

    setLastAction(status === ReceiptStatus.Approved ? 'approved' : 'rejected');
    setReceipts(prevReceipts => 
      prevReceipts.map((receipt, i) => i === currentIndex ? { ...receipt, status } : receipt)
    );
    setCurrentIndex(prevIndex => prevIndex + 1);
  };
  
  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = (results.data as any[]).filter(row => {
          const requestsTravel = row['requests travel (travel form)']?.trim().toLowerCase();
          const receiptUrl = row['receiptUrl']?.trim().toLowerCase();
          
          // Only include rows where travel was requested and a receipt URL is present and not 'none'
          return requestsTravel === 'yes' && receiptUrl && receiptUrl !== 'none';
        });

        const parsedData = cleanedData.map((row, index) => ({
          ...row,
          id: row.id || `receipt-${index}`,
          status: ReceiptStatus.Pending,
        }));
        setReceipts(parsedData);
        setCurrentIndex(0);
      },
    });
  };

  const downloadResults = () => {
    const exportData = receipts.map(receipt => {
      // Use 'as any' to handle all original columns from the CSV
      const { status, ...rest } = receipt as any;
      return {
        ...rest,
        verification_status: status,
      };
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'verified_receipts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetApp = () => {
    setReceipts([]);
    setCurrentIndex(0);
    setLastAction(null);
  }

  if (receipts.length === 0) {
    return <FileUpload onFileUpload={handleFileUpload} />;
  }

  const allDone = currentIndex >= receipts.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
        <header className="w-full max-w-md text-center mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Receipt Rover</h1>
            <p className="text-slate-600 dark:text-slate-400">Click to approve or reject receipts.</p>
        </header>
        
        <div className="w-full max-w-[350px] h-[550px] flex items-center justify-center">
            {!allDone && receipts[currentIndex] && (
              <ReceiptCard receipt={receipts[currentIndex]} />
            )}
        </div>
        
        {allDone ? (
            <div className="text-center p-8 mt-6 w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-emerald-500">All Done!</h2>
                <p className="mb-6 text-slate-600 dark:text-slate-400">You've reviewed all {receipts.length} receipts.</p>
                <div className="flex space-x-4 justify-center">
                    <button onClick={downloadResults} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                        Download Results
                    </button>
                    <button onClick={resetApp} className="px-6 py-3 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                        Start Over
                    </button>
                </div>
            </div>
        ) : (
            <>
                <ActionButtons 
                    onReject={() => handleDecision(ReceiptStatus.Rejected)} 
                    onApprove={() => handleDecision(ReceiptStatus.Approved)} 
                />
                <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
                    <p>Reviewed: {currentIndex} / {receipts.length}</p>
                    {lastAction ? <p className="capitalize">Last Action: {lastAction}</p> : <p>&nbsp;</p>}
                </div>
                <div className="flex space-x-4 justify-center mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 w-full max-w-sm">
                    <button onClick={downloadResults} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                        Download Progress
                    </button>
                    <button onClick={resetApp} className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                        Start Over
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default App;