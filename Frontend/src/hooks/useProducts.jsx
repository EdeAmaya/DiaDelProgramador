// hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import ProductsAPI from '../services/productsAPI';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductsAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear producto
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProductsAPI.createProduct(productData);
      console.log('Producto creado:', response);
      await fetchProducts(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al crear producto:', err);
      const errorMessage = err.message || 'Error al crear producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    if (!id) {
      const errorMessage = 'ID del producto es requerido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ProductsAPI.updateProduct(id, productData);
      console.log('Producto actualizado:', response);
      await fetchProducts(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      const errorMessage = err.message || 'Error al actualizar producto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    if (!id) {
      const errorMessage = 'ID del producto es requerido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ProductsAPI.deleteProduct(id);
      console.log('Producto eliminado:', response);
      await fetchProducts(); // Recargar lista
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      const errorMessage = err.message || 'Error al eliminar producto';
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

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
    clearError
  };
};