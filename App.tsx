
import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import Papa from 'papaparse';
import { Receipt, ReceiptStatus } from './types';
import FileUpload from './components/FileUpload';
import ActionButtons from './components/ActionButtons';
import ReceiptCard from './components/ReceiptCard';

// This is to avoid TS errors for a library that is not explicitly typed
// In a real project, we would add @types/react-tinder-card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TinderCardRef = any;

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  
  const currentIndexRef = useRef(currentIndex);
  
  const childRefs: MutableRefObject<TinderCardRef[]> = useRef([]);

  const canSwipe = currentIndex >= 0;

  const swiped = useCallback((direction: string, index: number) => {
    setLastDirection(direction);
    const newStatus = direction === 'right' ? ReceiptStatus.Approved : ReceiptStatus.Rejected;
    setReceipts(prevReceipts => 
      prevReceipts.map((receipt, i) => i === index ? { ...receipt, status: newStatus } : receipt)
    );
    updateCurrentIndex(index - 1);
  }, []);
  
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const outOfFrame = (name: string, idx: number) => {
    // handle the case where the card is swiped away quickly
    if (currentIndexRef.current >= idx && childRefs.current[idx]) {
        childRefs.current[idx].restoreCard();
    }
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe && currentIndex < receipts.length) {
      await childRefs.current[currentIndex].swipe(dir);
    }
  };
  
  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = (results.data as any[]).map((row, index) => ({
          ...row,
          id: row.id || `receipt-${index}`,
          status: ReceiptStatus.Pending,
        }));
        setReceipts(parsedData);
        setCurrentIndex(parsedData.length - 1);
        childRefs.current = Array(parsedData.length).fill(0).map(() => React.createRef());
      },
    });
  };

  const downloadResults = () => {
    const csv = Papa.unparse(receipts);
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
    setLastDirection(undefined);
    childRefs.current = [];
  }

  const reviewedCount = receipts.length - 1 - currentIndex;

  if (receipts.length === 0) {
    return <FileUpload onFileUpload={handleFileUpload} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
        <header className="w-full max-w-md text-center mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Receipt Rover</h1>
            <p className="text-slate-600 dark:text-slate-400">Swipe right to approve, left to reject.</p>
        </header>
        
        <div className="w-full max-w-[350px] h-[550px] relative">
            {receipts.map((receipt, index) => (
              <ReceiptCard
                ref={(el: TinderCardRef) => (childRefs.current[index] = el)}
                key={receipt.id}
                receipt={receipt}
                onSwipe={(dir) => swiped(dir, index)}
                onCardLeftScreen={() => outOfFrame(receipt.name, index)}
              />
            ))}
        </div>
        
        {currentIndex < 0 ? (
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
                <ActionButtons onReject={() => swipe('left')} onApprove={() => swipe('right')} />
                <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
                    <p>Reviewed: {reviewedCount} / {receipts.length}</p>
                    {lastDirection ? <p className="capitalize">Last Action: {lastDirection === 'right' ? 'Approved' : 'Rejected'}</p> : <p>&nbsp;</p>}
                </div>
            </>
        )}
    </div>
  );
};

export default App;
   