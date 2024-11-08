import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { X, Trash } from 'lucide-react-native';
import ConfirmationModal from './ConfirmationModal';
import { useTheme } from '../ThemeContext';
import { Category } from '../types';

interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  category: Category;
  onEdit: (newName: string) => void;
  onDelete: () => void;
}

export default function CategoryModal({ isVisible, onClose, category, onEdit, onDelete }: CategoryModalProps) {
  const { theme } = useTheme();
  const [categoryName, setCategoryName] = useState(category.name);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setCategoryName(category.name);
  }, [category.name]);

  const handleSave = () => {
    if (categoryName.trim() !== category.name) {
      onEdit(categoryName.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmation(false);
    onClose();
  };

  const styles = getStyles(theme);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel="Guardar cambios">
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
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
});