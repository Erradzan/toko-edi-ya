import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../services/Api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCheckout = () => {
    navigate(`/checkout?productId=${product.id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg relative max-w-4xl mx-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          <span className="text-lg text-gray-800 dark:text-gray-200">&times;</span>
        </button>
        <div className="w-full h-64 overflow-hidden mb-4 rounded">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">{product.title}</h2>
        <p className="text-white dark:text-gray-200 mb-2">Rp. {product.price.toFixed(2)}</p>
        <p className="text-white dark:text-gray-400">{product.description}</p>
        <button
          onClick={handleCheckout}
          className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Modal;
