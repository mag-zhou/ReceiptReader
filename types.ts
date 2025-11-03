
export enum ReceiptStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

export interface Receipt {
    id: string;
    name: string;
    email: string;
    receiptUrl: string;
    status: ReceiptStatus;
}

export interface GeminiAnalysis {
    isValid: boolean;
    reason: string;
    vendor: string;
    totalAmount: string;
    date: string;
}
   