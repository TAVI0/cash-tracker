import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import CategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import { Category } from '../types';

interface CategoriesModalProps {
  isVisible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onAddCategory: (category: Category) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onConfirmCategories: (categories: string[]) => void;
}

export default function CategoriesModal({
  isVisible,
  onClose,
  categories,
  selectedCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onConfirmCategories
}: CategoriesModalProps) {
  const { theme } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>(selectedCategories);

  const styles = getStyles(theme);

  const openCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (newName: string) => {
    if (selectedCategory) {
      onEditCategory(selectedCategory.name, newName);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      onDeleteCategory(selectedCategory.id);
    }
    setShowCategoryModal(false);
  };

  const handleAddCategory = (newCategoryName: string, color: string, primary: boolean) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      color,
      primary
    }
    onAddCategory(newCategory);
    setShowAddCategoryModal(false);
  };

  const handleToggleCategory = (categoryId: string) => {
    setTempSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleConfirmCategories = () => {
    onConfirmCategories(tempSelectedCategories);
    onClose();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        tempSelectedCategories.includes(item.id) && styles.selectedCategoryItem,
        { backgroundColor: item.color || (theme === 'light' ? '#F0F0F0' : '#3A3A3A') }
      ]}
      onPress={() => handleToggleCategory(item.id)}
      onLongPress={() => openCategoryModal(item)}
    >
      <Text style={styles.categoryItemText}>{item.name}</Text>
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
              keyExtractor={(item) => item.id}
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

      {selectedCategory && (
        <CategoryModal
          isVisible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          category={selectedCategory}
          onDelete={handleDeleteCategory}
          onEdit={handleEditCategory}
        />
      )}

      <AddCategoryModal
         isVisible={showAddCategoryModal}
         onClose={() => setShowAddCategoryModal(false)}
         onAddCategory={handleAddCategory}
      />
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