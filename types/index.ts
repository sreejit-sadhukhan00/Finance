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
