import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function Index() {
  const [type, setType] = useState<'ingreso' | 'egreso'>('egreso');
  const [typeCard, setTypeCard] = useState<'Debito' | 'Credito'>('Debito');
  const [categoryAdd, setCategoryAdd] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(['Servicio', 'Alimentos', 'Inversión']);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [installments, setInstallments] = useState('');

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

  return (
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
        placeholder="Valor"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.categoryButton, categoryAdd  && styles.selectedCategoryButton]}
          onPress={() => setCategoryAdd(prevState => !prevState)}
        >
          <Text style={[styles.categoryButtonText, categoryAdd && styles.selectedCategoryButtonText,  { fontWeight: 'bold' }]}>
                +
              </Text>
        </TouchableOpacity>

          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, category === cat && styles.selectedCategoryButton]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryButtonText, category === cat && styles.selectedCategoryButtonText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      

      {categoryAdd && (
        <>
          
                <View style={styles.addCategoryContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva categoría"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

        </>
      )}


      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.button, typeCard === 'Debito' && styles.selectedButton]}
          onPress={() => setTypeCard('Debito')}
        >
          <Text style={[styles.buttonText, typeCard === 'Debito' && styles.selectedButtonText]}>
          Debito
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
      </View>

      {typeCard === 'Credito' && (
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tarjeta:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['1234', '0987'].map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryButton, selectedCard === card && styles.selectedCategoryButton]}
                  onPress={() => setSelectedCard(card)}
                >
                  <Text style={[styles.categoryButtonText, selectedCard === card && styles.selectedCategoryButtonText]}>
                    **** {card}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cantidad de cuotas"
            keyboardType="numeric"
            value={installments}
            onChangeText={setInstallments}
          />
        </>
      )}

      <View style={styles.addCategoryContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
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
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#007AFF',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});