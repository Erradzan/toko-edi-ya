import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/authContext';
import withTheme from '../../hocs/withTheme';

interface CartPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ isDarkMode }) => {
  const { isAuthenticated, userRole } = useAuth();
  const { state, removeItem, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'customer') {
      navigate('/unauthorized', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleRemove = (productId: number) => {
    const productToRemove = state.items.find(item => item.ID === productId);
    if (productToRemove) {
      removeItem(productToRemove);
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const itemToUpdate = state.items.find(item => item.ID === productId);
    if (itemToUpdate) {
      if (quantity <= itemToUpdate.stock_qty && quantity >= 1) {
        updateQuantity(productId, quantity);
      } else if (quantity > itemToUpdate.stock_qty) {
        alert(`Cannot exceed the available stock of ${itemToUpdate.stock_qty}.`);
      }
    }
  };

  const toggleSelectItem = (productId: number) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCheckout = () => {
    const selectedProducts = state.items.filter(item => selectedItems.includes(item.ID));

    if (selectedProducts.length === 0) {
      alert('Please select at least one item to check out.');
      return;
    }

    const transactionData = {
      items: selectedProducts.map(item => ({
        productId: item.ID,
        quantity: item.quantity,
      })),
      totalAmount: selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0),
    };

    navigate('/checkout', { state: transactionData });

    console.log('Transaction Data:', transactionData);
  };

  return (
    <div
      className={`mx-auto p-4 pt-[100px] min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {state.items.length === 0 ? (
        <p>Your cart is empty, why are you still here? Buy something. Please??</p>
      ) : (
        <>
          <ul>
            {state.items.map(product => (
              <li
                key={product.ID}
                className="border-b border-gray-300 py-2 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product.ID)}
                    onChange={() => toggleSelectItem(product.ID)}
                    className="mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    <p>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(product.price)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        className="bg-gray-300 text-black px-2 py-1 rounded"
                        onClick={() => handleQuantityChange(product.ID, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold">{product.quantity}</span>
                      <button
                        className="bg-gray-300 text-black px-2 py-1 rounded"
                        onClick={() => handleQuantityChange(product.ID, product.quantity + 1)}
                        disabled={product.quantity >= product.stock_qty}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-[#f03846] text-white p-2 rounded"
                  onClick={() => handleRemove(product.ID)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => navigate('/')}
            >
              Back
            </button>
            <div>
              <button
                className="bg-[#f03846] text-white p-2 rounded mr-2"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleCheckout}
              >
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