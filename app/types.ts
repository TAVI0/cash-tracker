export interface Transaction {
    id: string;
    type: 'ingreso' | 'egreso';
    amount: number;
    description?: string;
    date: string;
    categories: string[];
    name: string;
    installments?: string;
    cardName?: string;
}

export interface Category{
    id: string;
    name: string;
}

export interface Accounts{
    id: string;
    name: string;
    
}