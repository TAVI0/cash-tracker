import React, { useState, useEffect } from 'react';
import { Category } from '../types';


type CategoryContextType = {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    selectedCategories: Category[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    addCategory: (category: Category) => void;
    deleteCategory: (category: Category) => void;
    loadCategories: () => void;

    onEditCategory: Category | null;
    setOnEditCategory: React.Dispatch<React.SetStateAction<Category | null>>;
};
  
const defaultContextValue: CategoryContextType = {
    categories: [],
    setCategories: () => { },
    selectedCategories:[],
    setSelectedCategories: () => { },
    addCategory: () => {},
    deleteCategory:  () => {},
    loadCategories: () => {},

    onEditCategory: null,
    setOnEditCategory: () => {},
  };

const CategoryContext = React.createContext<CategoryContextType>(defaultContextValue);


export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [onEditCategory, setOnEditCategory] = useState<Category | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    const saveCategories = async (updatedCategories: Category[]) => {
        try {
          await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        } catch (e) {
          console.error('Error saving categories:', e);
        }
    };
    
    const deleteCategory = (categoryToDelete: Category) => {
        const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
        setCategories(updatedCategories);
        setSelectedCategories(prev => prev.filter(cat => cat !== categoryToDelete));
        saveCategories(updatedCategories);
      };

    const addCategory = (newCategory: Category) => {
        if (newCategory && !categories.find((cat) => cat.id === newCategory.id)) {
          const updatedCategories = [...categories, newCategory];
          setCategories(updatedCategories);
          saveCategories(updatedCategories);
        }
     };

    const loadCategories = async () => {
        try {
          const savedCategories = await AsyncStorage.getItem('categories');
          if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
          }
        } catch (e) {
          console.error('Error loading categories:', e);
        }
      };

    return(
    <CategoryContext.Provider value={{
        categories, 
        setCategories,  
        addCategory, 
        deleteCategory, 
        selectedCategories, 
        setSelectedCategories, 
        loadCategories,  
        onEditCategory,
        setOnEditCategory,
    }}>
        {children}
    </CategoryContext.Provider>)
}


export const useCategoryContext = () => React.useContext(CategoryContext);
