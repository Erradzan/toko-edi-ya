import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../services/Api';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  payload?: CartItem;
}

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}>({
  state: { items: [] },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (action.payload) {
        const { id, quantity } = action.payload;
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity: item.quantity + quantity } : item
            ),
          };
        } else {
          return { ...state, items: [...state.items, action.payload] };
        }
      }
      return state;
    }
    case 'REMOVE_ITEM': {
      if (action.payload) {
        const { id } = action.payload;
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      return state;
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload) {
        const { id, quantity } = action.payload;
        return {
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        };
      }
      return state;
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (Array.isArray(storedCart)) {
      storedCart.forEach((item: CartItem) => {
        if (item && item.id) {
          dispatch({ type: 'ADD_ITEM', payload: item });
        }
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity: 1 } });
  const removeItem = (product: Product) => dispatch({ type: 'REMOVE_ITEM', payload: { ...product, quantity: 0 } });
  const updateQuantity = (productId: number, quantity: number) => {
    const itemToUpdate = state.items.find(item => item.id === productId);
    if (itemToUpdate) {
      const updatedItem = { ...itemToUpdate, quantity };
      dispatch({ type: 'UPDATE_QUANTITY', payload: updatedItem });
    }
  };
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;