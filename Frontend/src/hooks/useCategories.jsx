// hooks/useCategories.js
import { useState, useEffect, useCallback } from 'react';
import CategoriesAPI from '../services/categoriesAPI';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar categorías
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoriesAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError(err.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear categoría
  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoriesAPI.createCategory(categoryData);
      console.log('Categoría creada:', response);
      await fetchCategories(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al crear categoría:', err);
      const errorMessage = err.message || 'Error al crear categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar categoría
  const updateCategory = async (id, categoryData) => {
    if (!id) {
      const errorMessage = 'ID de la categoría es requerido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CategoriesAPI.updateCategory(id, categoryData);
      console.log('Categoría actualizada:', response);
      await fetchCategories(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al actualizar categoría:', err);
      const errorMessage = err.message || 'Error al actualizar categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const deleteCategory = async (id) => {
    if (!id) {
      const errorMessage = 'ID de la categoría es requerido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CategoriesAPI.deleteCategory(id);
      console.log('Categoría eliminada:', response);
      await fetchCategories(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      const errorMessage = err.message || 'Error al eliminar categoría';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efecto para cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
    clearError
  };
};