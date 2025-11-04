
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, [onFileUpload]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-lg text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Receipt Reader</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Quickly verify receipts with a click.</p>

                <div 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50'}`}
                >
                    <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <svg className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold">
                            Drag & drop your CSV file here
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">or click to browse</p>
                    </label>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                    Your CSV should have 'name', 'email', and 'receiptUrl' columns.
                </p>
            </div>
        </div>
    );
};

export default FileUpload;
   