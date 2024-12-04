import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import CategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import { Category } from '../types';
import { useCategoryContext } from './CategoryContext';

interface CategoriesModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CategoriesModal({
  isVisible,
  onClose
}: CategoriesModalProps) {
  const { theme } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<Category[]>([]);
  const [hasPrimary, setHasPrimary] = useState(false);

  const styles = getStyles(theme);

  const { categories,setSelectedCategories } = useCategoryContext();


  const openCategoryModal = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleToggleCategory = (category: Category) => {
    if(tempSelectedCategories.includes(category)){
      setTempSelectedCategories(tempSelectedCategories.filter(c => c !== category));
      if(category.primary){
        setHasPrimary(false);
      }
    }else{
      if((category.primary && !hasPrimary) || (!category.primary)){
        setTempSelectedCategories([...tempSelectedCategories, category]);
        if(category.primary){
          setHasPrimary(true);
        }
      }
    }

/*      setTempSelectedCategories(
        prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
      );
      */ 

  };

  const handleConfirmCategories = () => {
    const sortedCategories = [...tempSelectedCategories].sort((a, b) => {
      if (a.primary && !b.primary) return -1;
      if (!a.primary && b.primary) return 1;
      return 0;
    })
    setSelectedCategories(sortedCategories)
    onClose();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    
    
    return(
    <TouchableOpacity
      style={[
        styles.categoryItem,
        tempSelectedCategories.includes(item) && styles.selectedCategoryItem,
        {
          backgroundColor: item.color || (theme === 'light' ? '#F0F0F0' : '#3A3A3A'),
          borderColor: tempSelectedCategories.includes(item) ? '#FFFFFF' : 'transparent',
          borderWidth: tempSelectedCategories.includes(item) ? 2 : 2, // Borde visible solo si está seleccionado
        },
      ]}
      onPress={() => handleToggleCategory(item)}
      onLongPress={() => openCategoryModal(item)}
    >
      <Text
        style={[
          styles.categoryItemText,
          tempSelectedCategories.includes(item) && styles.selectedCategoryItemText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )};

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
        />
      )}

      <AddCategoryModal
         isVisible={showAddCategoryModal}
         onClose={() => setShowAddCategoryModal(false)}
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
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryItem: {
    backgroundColor: '#4CAF50',
  },
  categoryItemText: {
    color: theme === 'light' ? '#000000' : '#FFFFFF',
    textAlign: 'center',
  },
  selectedCategoryItemText: {
    color: '#FFFFFF',
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