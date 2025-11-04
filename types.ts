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
    reason?: string;
}