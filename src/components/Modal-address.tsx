import React, { useState } from 'react';
import axios from 'axios';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  isDarkMode: boolean;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, userId, isDarkMode }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAddress = async () => {
    if (!address) {
      setError('Address cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        'https://vicious-damara-gentaproject-0a193137.koyeb.app/addaddress',
        {
          userId,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Address added successfully');
        onClose();
      }
    } catch (error) {
      setError('Failed to add address. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode ? 'bg-[#888888]' : 'bg-white'} bg-opacity-50`}>
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add New Address</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          placeholder="Enter your new address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddAddress}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Address'}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddAddressModal;