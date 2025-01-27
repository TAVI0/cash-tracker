export interface Transaction {
    id: string;
    type: 'ingreso' | 'egreso';
    amount: number;
    description?: string;
    date: string;
    categories: Category[];
    name: string;
    installments?: string;
    cardName?: string;
}

export interface Category{
    id: string;
    name: string;
    color?: string;
    primary: boolean;
}

export interface Accounts{
    id: string;
    name: string;
}