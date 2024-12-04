import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { X, Trash } from 'lucide-react-native';
import ConfirmationModal from './ConfirmationModal';
import { useTheme } from '../ThemeContext';
import { Category } from '../types';
import { useCategoryContext } from './CategoryContext';
import { FlatList, GestureHandlerRootView, Switch } from 'react-native-gesture-handler';

interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  category: Category;
}

export default function CategoryModal({ isVisible, onClose, category }: CategoryModalProps) {
  const { theme } = useTheme();
  const [categoryName, setCategoryName] = useState(category.name);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPrimaryCategory, setIsPrimaryCategory] = useState(category.primary);
  const [selectedColor, setSelectedColor] = useState(category.color);


  const { deleteCategory, colorOptions, updateCategory } = useCategoryContext();

  useEffect(() => {
    setCategoryName(category.name);
    setIsPrimaryCategory(category.primary);
    if(category.primary){
      setSelectedColor(category.color);
    }else{
      setSelectedColor("");
    }
  }, [category.name]);

  const handleSave = () => {
    category.color= selectedColor;
    category.name = categoryName;
    category.primary = isPrimaryCategory;
    updateCategory(category)
    onClose();
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deleteCategory(category);
    setShowConfirmation(false);
    onClose();
  };

  const styles = getStyles(theme);
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
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Cerrar modal">
              <X color={theme === 'light' ? '#000' : '#FFF'} size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Categoría</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} accessibilityLabel="Eliminar categoría">
                <Trash color="#F44336" size={24} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                autoFocus
                selectTextOnFocus
                accessibilityLabel={`Editar nombre de la categoría: ${categoryName}`}
                accessibilityHint="Edita el nombre de la categoría"
              />
            </View>

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

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel="Guardar cambios">
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
      </Modal>
      <ConfirmationModal
        isVisible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        message="¿Estás seguro de que quieres eliminar esta categoría?"
      />
    </>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: theme === 'light' ? 'white' : '#2A2A2A',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'light' ? '#000' : '#FFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  deleteButton: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#444',
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: theme === 'light' ? '#000' : '#FFF',
    backgroundColor: theme === 'light' ? '#FFF' : '#3A3A3A',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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