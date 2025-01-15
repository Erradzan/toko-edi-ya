import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  ID: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  status: string;
  rating: number | null;
  seller: string;
  stock_qty: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  isDarkMode: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product, isDarkMode }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(product.price);

  const handleCheckout = () => {
    navigate(`/checkout?productId=${product.ID}`);
  };

  const rating = product.rating !== null ? product.rating : 0;

  return (
    <div
      className={`fixed inset-0 ${isDarkMode ? 'bg-[#888888]' : 'bg-white'} bg-opacity-50 flex items-center justify-center z-50`}
      onClick={handleOverlayClick}
    >
      <div className={`${isDarkMode ? 'bg-[#888888]' : 'bg-white'} p-4 rounded shadow-lg relative max-w-4xl mx-auto`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-400"
        >
          <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>&times;</span>
        </button>
        <div className="w-full h-64 overflow-hidden mb-4 rounded">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.title}</h2>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{formattedPrice}</p>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.description}</p>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.status}</p>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.seller}</p>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>Stock: {product.stock_qty}</p>
        <p className={`mb-2${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>Rating : {rating}/5</p>
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
