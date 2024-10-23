import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import CategoryModal from './CategoryModal';

interface CategoriesModalProps {
  isVisible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onAddCategory: (category: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (category: string) => void;
  onConfirmCategories: (categories: string[]) => void;
}

export default function CategoriesModal({
  isVisible,
  onClose,
  categories,
  selectedCategories,
  onToggleCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onConfirmCategories
}: CategoriesModalProps) {
  const { theme } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>(selectedCategories);

  const styles = getStyles(theme);

  const openCategoryModal = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (newName: string) => {
    onEditCategory(selectedCategory, newName);
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = () => {
    onDeleteCategory(selectedCategory);
    setShowCategoryModal(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  const handleToggleCategory = (category: string) => {
    setTempSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleConfirmCategories = () => {
    onConfirmCategories(tempSelectedCategories);
    onClose();
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        tempSelectedCategories.includes(item) && styles.selectedCategoryItem
      ]}
      onPress={() => handleToggleCategory(item)}
      onLongPress={() => openCategoryModal(item)}
    >
      <Text style={styles.categoryItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <>
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
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              numColumns={3}
              style={styles.categoriesList}
            />
            <View style={styles.addCategoryContainer}>
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => setShowAddCategoryModal(true)}
              >
                <Plus color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleConfirmCategories}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CategoryModal
        isVisible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
        onEdit={handleEditCategory}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCategoryModal}
        onRequestClose={() => setShowAddCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.addCategoryModalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddCategoryModal(false)}
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
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2A2A2A',
    borderRadius: 20,
    padding: 20,
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
  categoriesList: {
    marginBottom: 20,
  },
  categoryItem: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'light' ? '#F0F0F0' : '#3A3A3A',
  },
  selectedCategoryItem: {
    backgroundColor: theme === 'light' ? '#E3F2FD' : '#1A3A5A',
  },
  categoryItemText: {
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    textAlign: 'center',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  plusButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  input: {
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#3A3A3A',
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});