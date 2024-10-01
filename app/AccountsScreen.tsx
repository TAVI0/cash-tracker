import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from './ThemeContext';
import { Transaction } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    loadTransactions();
  }, []);

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

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionAmount}>
          {item.type === 'ingreso' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <View style={styles.categoriesContainer}>
        {item.categories.map((cat, index) => (
          <Text key={index} style={styles.categoryTag}>{cat}</Text>
        ))}
      </View>
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        {item.installments && (
          <Text style={styles.transactionInstallments}>Cuotas: {item.installments}</Text>
        )}
        {item.cardName && (
          <Text style={styles.transactionCard}>Tarjeta: {item.cardName}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Registros</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noTransactions}>No hay transacciones registradas.</Text>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#FFF',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: theme === 'light' ? '#FFF' : '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#FFF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme === 'light' ? '#4CAF50' : '#81C784',
  },
  transactionDescription: {
    fontSize: 14,
    color: theme === 'light' ? '#333' : '#DDD',
    marginBottom: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  categoryTag: {
    fontSize: 12,
    color: theme === 'light' ? '#FFF' : '#000',
    backgroundColor: theme === 'light' ? '#007AFF' : '#4DA6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 12,
    color: theme === 'light' ? '#666' : '#AAA',
  },
  transactionInstallments: {
    fontSize: 12,
    color: theme === 'light' ? '#666' : '#AAA',
  },
  transactionCard: {
    fontSize: 12,
    color: theme === 'light' ? '#666' : '#AAA',
  },
  noTransactions: {
    fontSize: 16,
    color: theme === 'light' ? '#666' : '#AAA',
    textAlign: 'center',
    marginTop: 20,
  },
});