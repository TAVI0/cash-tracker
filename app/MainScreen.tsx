import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from './ThemeContext';
import { Category, Transaction } from './types';
import { Plus } from 'lucide-react-native';
import CategoriesModal from './Categories/CategoriesModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCategoryContext } from './Categories/CategoryContext';
import { useTransactionContext } from './Transaction/TransactionContext';

export default function MainScreen() {
  const { theme } = useTheme();
  const [type, setType] = useState<'ingreso' | 'egreso'>('egreso');
  const [typeCard, setTypeCard] = useState<'Debito' | 'Credito' | 'Efectivo'>('Credito');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [installments, setInstallments] = useState('');
  const [name, setName] = useState('');
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const styles = getStyles(theme);

  const { categories, selectedCategories, setSelectedCategories, loadCategories } = useCategoryContext();
  const { addTransaction } = useTransactionContext();

  useEffect(() => {
    loadCategories();
  }, []);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleRegister = async () => {
    if (amount && selectedCategories.length > 0 && name) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: type,
        amount: parseFloat(amount),
        description,
        date: date.toLocaleDateString(),
        categories: selectedCategories,
        name,
        installments: typeCard === 'Credito' ? installments : undefined,
        cardName: typeCard !== 'Efectivo' ? selectedCard : undefined,
      };

      try {
        addTransaction(newTransaction);
        
        console.log('Transacción guardada:', newTransaction);
        console.log('Todas las transacciones:', categories);

        clearFields()

      } catch (e) {
        console.error('Error al guardar la transacción:', e);
      }
    }
  };

  const clearFields = ()=>{
    setAmount('');
    setDescription('');
    setName('');
    setInstallments('');
    setSelectedCard('');
    setSelectedCategories([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.button, type === 'ingreso' && styles.selectedButton]}
            onPress={() => setType('ingreso')}
          >
            <Text style={[styles.buttonText, type === 'ingreso' && styles.selectedButtonText]}>
              Ingreso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, type === 'egreso' && styles.selectedButton]}
            onPress={() => setType('egreso')}
          >
            <Text style={[styles.buttonText, type === 'egreso' && styles.selectedButtonText]}>
              Egreso
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>
            Fecha: {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor='#888'
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor"
          placeholderTextColor='#888'
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          placeholderTextColor='#888'
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Categoría:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => {
                console.log(categories);
                setShowCategoriesModal(true);
              }}            >
              <Plus color={theme === 'light' ? '#007AFF' : '#4DA6FF'} size={24} />
            </TouchableOpacity>

            {selectedCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, styles.selectedButton,{backgroundColor: cat.color || (theme === 'light' ? '#F0F0F0' : '#3A3A3A'),}]}
                onPress={() => setShowCategoriesModal(true)}
              >
                <Text style={styles.selectedCategoryButtonText}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.button, typeCard === 'Efectivo' && styles.selectedButton]}
            onPress={() => setTypeCard('Efectivo')}
          >
            <Text style={[styles.buttonText, typeCard === 'Efectivo' && styles.selectedButtonText]}>
              Efectivo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, typeCard === 'Credito' && styles.selectedButton]}
            onPress={() => setTypeCard('Credito')}
          >
            <Text style={[styles.buttonText, typeCard === 'Credito' && styles.selectedButtonText]}>
              Credito
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, typeCard === 'Debito' && styles.selectedButton]}
            onPress={() => setTypeCard('Debito')}
          >
            <Text style={[styles.buttonText, typeCard === 'Debito' && styles.selectedButtonText]}>
              Debito
            </Text>
          </TouchableOpacity>
        </View>

        {(typeCard === 'Credito' || typeCard === 'Debito') && (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Tarjeta:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(typeCard === 'Credito' ? ['**** 1234', '**** 0987'] : ['**** 2314', '**** 3333']).map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryButton, selectedCard === card && styles.selectedButton]}
                    onPress={() => setSelectedCard(card)}
                  >
                    <Text style={[styles.buttonText, selectedCard === card && styles.selectedCategoryButtonText]}>
                      {card}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {typeCard === 'Credito' && (
              <TextInput
                style={styles.input}
                placeholder="Cantidad de cuotas"
                placeholderTextColor='#888'
                keyboardType="numeric"
                value={installments}
                onChangeText={setInstallments}
              />
            )}
          </>
        )}

        <View style={styles.addCategoryContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CategoriesModal
        isVisible={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#F0F0F0' : '#1A1A1A',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#007AFF' : '#4DA6FF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
  },
  selectedButton: {
    backgroundColor: theme === 'light' ? '#F0F0F0' : '#3A3A3A',
  },
  buttonText: {
    color: theme === 'light' ? '#007AFF' : '#4DA6FF',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  datePickerButton: {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  input: {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  categoryButton: {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    flex: 1,
    margin: 5,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});