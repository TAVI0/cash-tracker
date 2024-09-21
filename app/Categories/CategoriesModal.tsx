import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';

interface CategoriesModalProps {
  isVisible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onAddCategory: (category: string) => void;
}

export default function CategoriesModal({
  isVisible,
  onClose,
  categories,
  selectedCategories,
  onToggleCategory,
  onAddCategory
}: CategoriesModalProps) {
  const { theme } = useTheme();
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const styles = getStyles(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X color={theme === 'light' ? '#000' : '#FFF'} size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Seleccionar Categorías</Text>
          <ScrollView style={styles.categoriesList}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(cat) && styles.selectedCategoryItem
                ]}
                onPress={() => onToggleCategory(cat)}
              >
                <Text style={styles.categoryItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.addCategoryContainer}>
            <TextInput
              style={styles.newCategoryInput}
              placeholder="Nueva categoría"
              placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  modalContent: {
    width: '80%',
    maxHeight: '80%',
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
  categoriesList: {
    marginBottom: 20,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#EEEEEE' : '#444444',
  },
  selectedCategoryItem: {
    backgroundColor: theme === 'light' ? '#E3F2FD' : '#1A3A5A',
  },
  categoryItemText: {
    color: theme === 'light' ? '#000000' : '#FFFFFF',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#3A3A3A',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});