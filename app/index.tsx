import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Sun, Moon, Scale, DollarSign } from 'lucide-react-native';
import CategoryModal from './CategoryModal';
import AccountsScreen from './AccountsScreen';
import { Transaction } from './types';

// Definición actualizada del tipo Transaction

function Index() {
  const { theme, toggleTheme } = useTheme();
  const [type, setType] = useState<'ingreso' | 'egreso'>('egreso');
  const [typeCard, setTypeCard] = useState<'Debito' | 'Credito' | 'Efectivo'>('Credito');
  const [categoryAdd, setCategoryAdd] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(['Servicio', 'Alimentos', 'Ropa']);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [installments, setInstallments] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'accounts'>('main');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState('');

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const openCategoryModal = (cat: string) => {
    setSelectedCategory(cat);
    setModalVisible(true);
  };

  const editCategory = (newName: string) => {
    setCategories(categories.map(cat => cat === selectedCategory ? newName : cat));
    setCategory(newName);
  };

  const deleteCategory = () => {
    setCategories(categories.filter(cat => cat !== selectedCategory));
    setCategory('');
  };

  const handleRegister = () => {
    if (amount && category && name) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: type,
        amount: parseFloat(amount),
        description,
        date: date.toLocaleDateString(),
        category,
        name,
        installments: typeCard === 'Credito' ? installments : undefined,
        cardName: typeCard !== 'Efectivo' ? selectedCard : undefined,
      };
      setTransactions([newTransaction, ...transactions]);
      // Limpiar los campos después de registrar
      setAmount('');
      setDescription('');
      setCategory('');
      setName('');
      setInstallments('');
      setSelectedCard('');
    }
  };

  const styles = getStyles(theme);

  const renderMainScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
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
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.categoryButton, categoryAdd && styles.selectedCategoryButton]}
            onPress={() => setCategoryAdd(prevState => !prevState)}
          >
            <Text style={[styles.categoryButtonText, categoryAdd && styles.selectedCategoryButtonText, { fontWeight: 'bold' }]}>
              +
            </Text>
          </TouchableOpacity>

          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, category === cat && styles.selectedCategoryButton]}
              onPress={() => setCategory(cat)}
              onLongPress={() => openCategoryModal(cat)}
            >
              <Text style={[styles.categoryButtonText, category === cat && styles.selectedCategoryButtonText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {categoryAdd && (
        <View style={styles.addCategoryContainer}>
          <TextInput
            style={styles.newCategoryInput}
            placeholder="Nueva categoría"
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={addCategory}>
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      )}

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
                  style={[styles.categoryButton, selectedCard === card && styles.selectedCategoryButton]}
                  onPress={() => setSelectedCard(card)}
                >
                  <Text style={[styles.categoryButtonText, selectedCard === card && styles.selectedCategoryButtonText]}>
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
              placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
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

      <CategoryModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        category={selectedCategory}
        onEdit={editCategory}
        onDelete={deleteCategory}
      />

      <TouchableOpacity
        style={styles.themeToggle}
        onPress={toggleTheme}
        accessibilityLabel={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      >
        {theme === 'light' ? (
          <Moon color="#000" size={24} />
        ) : (
          <Sun color="#FFF" size={24} />
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      {currentScreen === 'main' ? renderMainScreen() : (
        <AccountsScreen transactions={transactions} />
      )}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentScreen('main')}
          accessibilityLabel="Ver ingresos"
        >
          <DollarSign color={theme === 'light' ? '#000' : '#FFF'} size={24} />
          <Text style={styles.navButtonText}>Ingresos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentScreen('accounts')}
          accessibilityLabel="Ver cuentas"
        >
          <Scale color={theme === 'light' ? '#000' : '#FFF'} size={24} />
          <Text style={styles.navButtonText}>Cuentas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
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
    backgroundColor: theme === 'light' ? '#007AFF' : '#4DA6FF',
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: theme === 'light' ? '#007AFF' : '#4DA6FF',
  },
  categoryButtonText: {
    color: theme === 'light' ? '#007AFF' : '#4DA6FF',
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
  themeToggle: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: theme === 'light' ? '#E0E0E0' : '#3A3A3A',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: theme === 'light' ? '#000' : '#FFF',
    marginTop: 5,
    fontSize: 12,
  },
});

export default function ThemedIndex() {
  return (
    <ThemeProvider>
      <Index />
    </ThemeProvider>
  );
}