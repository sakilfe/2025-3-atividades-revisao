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

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const BASE_URL = 'https://dummyjson.com';

class ApiService {
  // Produtos
  async getProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      throw error;
    }
  }

  async getProductCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produtos com query "${query}":`, error);
      throw error;
    }
  }

  // Usuários
  async getUsers(limit: number = 30, skip: number = 0): Promise<UsersResponse> {
    try {
      const response = await fetch(`${BASE_URL}/users?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<UsersResponse> {
    try {
      const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar usuários com query "${query}":`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { Product, User, ProductsResponse, UsersResponse };