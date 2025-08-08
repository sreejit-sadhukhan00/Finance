export interface Account {
    id: string;
    name: string;
    type: 'CURRENT' | 'SAVINGS';
    balance: string;
    isDefault: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        transactions: number;
    };
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';
export type RecurringInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description?: string;
    date: Date;
    category?: string;
    recieptUrl?: string;
    isRecurring: boolean;
    recurringInterval?: RecurringInterval;
    nextRecurringDate?: Date;
    lastProcessed?: Date;
    status: TransactionStatus;
    userId: string;
    accountId: string;
    createdAt: Date;
    updatedAt: Date;
}
