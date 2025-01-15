import React, { useState } from 'react';
import axios from 'axios';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'https://vicious-damara-gentaproject-0a193137.koyeb.app/discount',
        {
          code,
          discount_value: parseFloat(discountValue),
          expiration_date: expirationDate,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onClose();
    } catch (err) {
      setError('Failed to add discount.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isDarkMode ? 'bg-[#888888]' : 'bg-white'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Discount</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Code"
          className="w-full mb-3 p-2 border rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount Value"
          className="w-full mb-3 p-2 border rounded"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
        />
        <input
          type="date"
          placeholder="Expiration Date"
          className="w-full mb-3 p-2 border rounded"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white py-1 px-4 rounded mr-2">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-1 px-4 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;