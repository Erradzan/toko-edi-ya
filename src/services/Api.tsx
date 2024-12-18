import axios from 'axios';

const API_BASE_URL = 'https://contemporary-milissent-gentaproject-897ea311.koyeb.app/';
const FAKESTORE_BASE_URL = 'https://fakestoreapi.com';

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface Category {
  name: string;
}

export const registerUser = async (data: { email: string; password: string; name?: string; avatar?: string }): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, data);
    return response.data;
  } catch (error: any) { 
    console.error('Error details:', error.response ? error.response.data : error.message);
    throw new Error('Registration failed');
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: errorMsg,
      });
      throw new Error(errorMsg || 'Login failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${FAKESTORE_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${FAKESTORE_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch product');
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${FAKESTORE_BASE_URL}/products/categories`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};