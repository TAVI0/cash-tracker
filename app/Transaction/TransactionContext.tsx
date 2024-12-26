import React, { useState } from "react";
import { Transaction } from "../types";

type TransactionContextType = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    deleteTransaction: (transaction:Transaction) => void;
    loadTransactions: () => void;
    addTransaction: (transaction:Transaction) => void;
    updateTransaction: (transaction:Transaction) => void;
}

const defaultContextValue: TransactionContextType = {
    transactions: [],
    setTransactions: () => {},
    deleteTransaction: () => {},
    loadTransactions: () => {},
    addTransaction: () => {},
    updateTransaction: () => {},
}

const TransactionContext = React.createContext<TransactionContextType>(defaultContextValue);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const saveTransaction = async(updateTransactions: Transaction[]) =>{
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(updateTransactions));
    } catch (e) {
      console.error('Error saving transactions:', e);
    }
  }

  const deleteTransaction = async(tranToDelete:Transaction)=>{
      const updatedTransactions = transactions.filter(transac => transac !== tranToDelete);
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      //console.log('Transacciones guardadas:', updatedTransactions);
    };

  const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions);
        //  console.log('Loaded transactions:', parsedTransactions);
          setTransactions(parsedTransactions);
        }
      } catch (e) {
        console.error('Error al cargar transacciones:', e);
      }
    };

  const addTransaction = (newTransaction: Transaction) => {
    if (newTransaction && !transactions.find((tra) => tra.id === newTransaction.id)) {
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      saveTransaction(updatedTransactions);
    }
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    if (!updatedTransaction) return;
  
    const transactionIndex = transactions.findIndex((tra) => tra.id === updatedTransaction.id);
    if (transactionIndex !== -1) {
      const updatedTransactions = [...transactions];
      updatedTransactions[transactionIndex] = updatedTransaction;
      setTransactions(updatedTransactions);
      saveTransaction(updatedTransactions);
    }
  };

  return(
    <TransactionContext.Provider value={{
        transactions,
        setTransactions,
        deleteTransaction,
        loadTransactions,
        addTransaction,
        updateTransaction,
    }}>
        {children}
    </TransactionContext.Provider>
  )
}

export const useTransactionContext = () => React.useContext(TransactionContext);