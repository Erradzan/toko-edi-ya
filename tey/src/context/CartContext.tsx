import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
  ID: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  seller: string;
  quantity: number;
  stock_qty: number;
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
  addItem: (product: CartItem) => void;
  removeItem: (product: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}>( {
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
        const { ID, quantity } = action.payload;
        const existingItem = state.items.find(item => item.ID === ID);
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.ID === ID ? { ...item, quantity: item.quantity + quantity } : item
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
        const { ID } = action.payload;
        return {
          ...state,
          items: state.items.filter(item => item.ID !== ID),
        };
      }
      return state;
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload) {
        const { ID, quantity } = action.payload;
        return {
          ...state,
          items: state.items.map(item =>
            item.ID === ID ? { ...item, quantity } : item
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
  const [, setProducts] = React.useState<CartItem[]>([]);

  useEffect(() => {
    axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/product')
      .then(response => {
        const products = response.data.data.map((item: any) => ({
          ...item,
          quantity: 1,
        }));
        setProducts(products);
      })
      .catch(error => {
        console.error('Error fetching products', error);
      });
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (Array.isArray(storedCart)) {
      storedCart.forEach((item: CartItem) => {
        if (item && item.ID) {
          dispatch({ type: 'ADD_ITEM', payload: item });
        }
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: CartItem) => dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity: 1 } });
  const removeItem = (product: CartItem) => dispatch({ type: 'REMOVE_ITEM', payload: { ...product, quantity: 0 } });

  const updateQuantity = (productId: number, quantity: number) => {
    const itemToUpdate = state.items.find(item => item.ID === productId);
    if (itemToUpdate) {
      const updatedQuantity = Math.min(quantity, itemToUpdate.stock_qty);
      const updatedItem = { ...itemToUpdate, quantity: updatedQuantity };
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