import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from './ThemeContext';
import { Transaction } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AccountsScreenProps {
  transactions: Transaction[];
}

export default function AccountsScreen({ transactions }: AccountsScreenProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      {item.category.map((cat, index)=>(
        <Text  key={index} style={styles.transactionDescription}>{cat}</Text>
      ))}
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        {item.installments && (
          <Text style={styles.transactionInstallments}>Cuotas: {item.installments}</Text>
        )}
        {item.cardName && (
          <Text style={styles.transactionCard}>Tarjeta: {item.cardName}</Text>
        )}
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'ingreso' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {item.type === 'ingreso' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView>
      <Text style={styles.title}>Registros</Text>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000' : '#FFF',
    marginTop: 40,
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
  transactionCategory: {
    fontSize: 14,
    color: theme === 'light' ? '#666' : '#AAA',
  },
  transactionDescription: {
    fontSize: 14,
    color: theme === 'light' ? '#333' : '#DDD',
    marginBottom: 5,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#F44336',
  },
});