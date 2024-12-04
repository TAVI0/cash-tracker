import React, { useState } from 'react';
import { View } from "react-native";
import { X } from "lucide-react-native";
import { Modal, StyleSheet, Text } from "react-native";
import { TextInput, TouchableOpacity, GestureHandlerRootView, Switch, FlatList } from "react-native-gesture-handler";
import { useTheme } from "../ThemeContext";
import { Category } from '../types';
import { useCategoryContext } from './CategoryContext';

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isVisible, onClose }: AddCategoryModalProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isPrimaryCategory, setIsPrimaryCategory] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  const { addCategory, colorOptions } = useCategoryContext();

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        color: selectedColor,
        primary: isPrimaryCategory
      }
      addCategory(newCategory)
      setNewCategoryName('');
      setIsPrimaryCategory(false);
      setSelectedColor('');
      onClose();
    }
  };

  const renderColorButton = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.colorButton,
        { backgroundColor: item },
        selectedColor === item && styles.selectedColorButton
      ]}
      onPress={() => setSelectedColor(item)}
    />
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <View style={styles.addCategoryModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X color={theme === 'light' ? '#000' : '#FFF'} size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Agregar Nueva Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la categoría"
              placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Categoría Primaria</Text>
              <Switch
                value={isPrimaryCategory}
                onValueChange={setIsPrimaryCategory}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isPrimaryCategory ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
            {isPrimaryCategory && (
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorPickerLabel}>Seleccionar Color:</Text>
                <FlatList
                  data={colorOptions}
                  renderItem={renderColorButton}
                  keyExtractor={(item) => item}
                  numColumns={4}
                  contentContainerStyle={styles.colorButtonsContainer}
                />
              </View>
            )}

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  modalContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addCategoryModalContent: {
    width: '80%',
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#3A3A3A',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  colorPickerContainer: {
    marginBottom: 20,
  },
  colorPickerLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  colorButtonsContainer: {
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: theme === 'light' ? '#000000' : '#FFFFFF',
  },
});