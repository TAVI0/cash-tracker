import React, { useState } from "react";
import { Transaction } from "../types";

type TransactionContextType = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    deleteTransaction: (transaction:Transaction) => void;
    loadTransactions: () => void;
}

const defaultContextValue: TransactionContextType = {
    transactions: [],
    setTransactions: () => {},
    deleteTransaction: () => {},
    loadTransactions: () => {},
}

const TransactionContext = React.createContext<TransactionContextType>(defaultContextValue);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    const deleteTransaction = async(tranToDelete:Transaction)=>{
        const updatedTransactions = transactions.filter(transac => transac !== tranToDelete);
        setTransactions(updatedTransactions);
        await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        console.log('Transacciones guardadas:', updatedTransactions);
      };

    const loadTransactions = async () => {
        try {
          const storedTransactions = await AsyncStorage.getItem('transactions');
          if (storedTransactions) {
            const parsedTransactions = JSON.parse(storedTransactions);
            console.log('Loaded transactions:', parsedTransactions);
            setTransactions(parsedTransactions);
          }
        } catch (e) {
          console.error('Error al cargar transacciones:', e);
        }
      };

    return(
        <TransactionContext.Provider value={{
            transactions,
            setTransactions,
            deleteTransaction,
            loadTransactions,
        }}>
            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactionContext = () => React.useContext(TransactionContext);