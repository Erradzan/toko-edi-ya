import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import withTheme from '../hocs/withTheme';

interface CartPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ isDarkMode }) => {
  const { state, removeItem, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleRemove = (productId: number) => {
    const productToRemove = state.items.find(item => item.id === productId);
    if (productToRemove) {
      removeItem(productToRemove);
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  return (
    <div className={`mx-auto p-4 pt-[100px] min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {state.items.length === 0 ? (
        <p>Your cart is empty, why are you still here? Buy something. Please??</p>
      ) : (
        <>
          <ul>
            {state.items.map(product => (
              <li key={product.id} className="border-b border-gray-300 py-2 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p>${product.price.toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold">{product.quantity}</span>
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="bg-[#f03846] text-white p-2 rounded"
                  onClick={() => handleRemove(product.id)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </button>
            <div>
              <button className="bg-[#f03846] text-white p-2 rounded mr-2" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="bg-blue-500 text-white p-2 rounded">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withTheme(CartPage);