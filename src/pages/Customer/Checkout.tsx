import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';

const CheckoutPage: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string; number: string }[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/paymentmethod');
        if (response.data.data) {
          setPaymentMethods(response.data.data);
        } else {
          setErrorMessage('Failed to retrieve payment methods.');
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setErrorMessage('An error occurred while fetching payment methods.');
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    const products = state.items.map(item => ({
      product_id: item.ID,
      quantity: item.quantity,
    }));

    const transactionData = {
      payment_method_id: selectedPaymentMethod,
      discount_code: discountCode,
      products,
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'https://vicious-damara-gentaproject-0a193137.koyeb.app/transaction',
        transactionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    
      if (response.status === 200) {
        alert('Checkout successful!');
      } else {
        console.error('Error during checkout:', response.data);
        alert(`Error: ${response.data.message || 'Something went wrong during checkout.'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="mx-auto p-4 pt-[100px] min-h-screen bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Cart Summary</h2>
        <ul>
          {state.items.map(product => (
            <li key={product.ID} className="border-b border-gray-300 py-2">
              <h3>{product.title}</h3>
              <p>
                Quantity: {product.quantity} x {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(product.price)}
              </p>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-2">
          Total:{' '}
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(
            state.items.reduce((total, item) => total + item.price * item.quantity, 0)
          )}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <select
          className="border border-gray-300 rounded p-2 w-40"
          value={selectedPaymentMethod || ''}
          onChange={e => setSelectedPaymentMethod(Number(e.target.value))}
        >
          <option value="" disabled>Select a payment method</option>
          {paymentMethods.map(method => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Discount Code</h2>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-40"
          placeholder="Enter discount code"
          value={discountCode}
          onChange={e => setDiscountCode(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={() => navigate('/cart')}
        >
          Back to Cart
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleCheckout}
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;