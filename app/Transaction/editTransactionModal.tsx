import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { Transaction } from "../types";
import { useTransactionContext } from './TransactionContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoriesModal from '../Categories/CategoriesModal';
import { useCategoryContext } from '../Categories/CategoryContext';

interface TransactionModalProps {
    isVisible: boolean;
    onClose: () => void;
    transaction: Transaction;
}

export default function EditTransactionModal({ isVisible, onClose, transaction }: TransactionModalProps) {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const { updateTransaction } = useTransactionContext();
    const { categories } = useCategoryContext();

    const [editedTransaction, setEditedTransaction] = useState<Transaction>({ ...transaction });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);

    useEffect(() => {
        setEditedTransaction({ ...transaction });
    }, [transaction]);

    const handleSave = () => {
        updateTransaction(editedTransaction);
        onClose();
    };

    const onDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEditedTransaction(prev => ({ ...prev, date: selectedDate.toLocaleDateString() }));
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X color={theme === 'light' ? '#000' : '#FFF'} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Editar Transacción</Text>
                    <ScrollView>
                        <TextInput
                            style={styles.input}
                            value={editedTransaction.name}
                            onChangeText={(text) => setEditedTransaction(prev => ({ ...prev, name: text }))}
                            placeholder="Nombre"
                            placeholderTextColor={theme === 'light' ? '#888' : '#AAA'}
                        />
                        <TextInput
                            style={styles.input}
                            value={editedTransaction.amount.toString()}
                            onChangeText={(text) => setEditedTransaction(prev => ({ ...prev, amount: parseFloat(text) || 0 }))}
                            placeholder="Monto"
                            placeholderTextColor={theme === 'light' ? '#888' : '#AAA'}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={editedTransaction.description}
                            onChangeText={(text) => setEditedTransaction(prev => ({ ...prev, description: text }))}
                            placeholder="Descripción"
                            placeholderTextColor={theme === 'light' ? '#888' : '#AAA'}
                        />
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateButtonText}>Fecha: {editedTransaction.date}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date(editedTransaction.date)}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                        <TouchableOpacity style={styles.categoryButton} onPress={() => setShowCategoriesModal(true)}>
                            <Text style={styles.categoryButtonText}>Editar Categorías</Text>
                        </TouchableOpacity>
                        {editedTransaction.cardName && (
                            <TextInput
                                style={styles.input}
                                value={editedTransaction.cardName}
                                onChangeText={(text) => setEditedTransaction(prev => ({ ...prev, cardName: text }))}
                                placeholder="Nombre de la tarjeta"
                                placeholderTextColor={theme === 'light' ? '#888' : '#AAA'}
                            />
                        )}
                        {editedTransaction.installments && (
                            <TextInput
                                style={styles.input}
                                value={editedTransaction.installments}
                                onChangeText={(text) => setEditedTransaction(prev => ({ ...prev, installments: text }))}
                                placeholder="Cuotas"
                                placeholderTextColor={theme === 'light' ? '#888' : '#AAA'}
                                keyboardType="numeric"
                            />
                        )}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
            <CategoriesModal
                isVisible={showCategoriesModal}
                onClose={() => setShowCategoriesModal(false)}
              //  onCategoriesSelected={(categories) => setEditedTransaction(prev => ({ ...prev, categories }))}
              //  selectedCategories={editedTransaction.categories}
            />
        </Modal>
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
        width: '90%',
        maxHeight: '80%',
        backgroundColor: theme === 'light' ? 'white' : '#2A2A2A',
        borderRadius: 20,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: theme === 'light' ? '#000' : '#FFF',
    },
    input: {
        height: 40,
        borderColor: theme === 'light' ? '#CCC' : '#555',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: theme === 'light' ? '#000' : '#FFF',
    },
    dateButton: {
        backgroundColor: theme === 'light' ? '#E0E0E0' : '#3A3A3A',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    dateButtonText: {
        color: theme === 'light' ? '#000' : '#FFF',
    },
    categoryButton: {
        backgroundColor: theme === 'light' ? '#E0E0E0' : '#3A3A3A',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    categoryButtonText: {
        color: theme === 'light' ? '#000' : '#FFF',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
