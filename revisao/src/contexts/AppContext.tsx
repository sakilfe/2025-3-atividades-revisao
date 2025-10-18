'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  thumbnail: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface AppState {
  products: Product[];
  users: User[];
  cart: CartItem[];
  favorites: number[];
  selectedCategory: string;
  searchTerm: string;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  products: [],
  users: [],
  cart: [],
  favorites: [],
  selectedCategory: 'all',
  searchTerm: '',
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}

// Hooks personalizados para funcionalidades específicas
export function useCart() {
  const { state, dispatch } = useApp();

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
}

export function useFavorites() {
  const { state, dispatch } = useApp();

  const toggleFavorite = (productId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: productId });
  };

  const isFavorite = (productId: number) => {
    return state.favorites.includes(productId);
  };

  return {
    favorites: state.favorites,
    toggleFavorite,
    isFavorite,
  };
}

export function useProducts() {
  const { state, dispatch } = useApp();

  const setProducts = (products: Product[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  };

  const loadProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { apiService } = await import('../services/apiService');
      const response = await apiService.getProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: response.products });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadProductsByCategory = async (category: string) => {
    if (category === 'all') {
      return loadProducts();
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { apiService } = await import('../services/apiService');
      const response = await apiService.getProductsByCategory(category);
      dispatch({ type: 'SET_PRODUCTS', payload: response.products });
    } catch (error) {
      console.error('Erro ao carregar produtos por categoria:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      return loadProducts();
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { apiService } = await import('../services/apiService');
      const response = await apiService.searchProducts(query);
      dispatch({ type: 'SET_PRODUCTS', payload: response.products });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getFilteredProducts = () => {
    let filtered = state.products;

    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === state.selectedCategory);
    }

    if (state.searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const getCategories = () => {
    const categories = state.products.map(product => product.category);
    return ['all', ...Array.from(new Set(categories))];
  };

  return {
    products: state.products,
    filteredProducts: getFilteredProducts(),
    categories: getCategories(),
    selectedCategory: state.selectedCategory,
    searchTerm: state.searchTerm,
    loading: state.loading,
    setProducts,
    loadProducts,
    loadProductsByCategory,
    searchProducts,
    setCategory: (category: string) => dispatch({ type: 'SET_CATEGORY', payload: category }),
    setSearchTerm: (term: string) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
  };
}

export function useUsers() {
  const { state, dispatch } = useApp();

  const setUsers = (users: User[]) => {
    dispatch({ type: 'SET_USERS', payload: users });
  };

  const loadUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { apiService } = await import('../services/apiService');
      const response = await apiService.getUsers();
      dispatch({ type: 'SET_USERS', payload: response.users });
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      return loadUsers();
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { apiService } = await import('../services/apiService');
      const response = await apiService.searchUsers(query);
      dispatch({ type: 'SET_USERS', payload: response.users });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    users: state.users,
    loading: state.loading,
    setUsers,
    loadUsers,
    searchUsers,
  };
}