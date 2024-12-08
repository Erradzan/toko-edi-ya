import React, { useEffect, useState } from 'react';
import { Product } from '../services/Api';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Modal from './Modal-login';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { state, addItem, removeItem } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Example: Check login status

  useEffect(() => {
    const isProductInCart = state.items.some(item => item.id === product.id);
    setIsAddedToCart(isProductInCart);
  }, [state.items, product.id]);

  const handleCartToggle = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      return;
    }

    if (isAddedToCart) {
      removeItem(product);
    } else {
      addItem(product);
    }
    setIsAddedToCart(!isAddedToCart);
  };

  return (
    <>
      <div
        className="relative border border-black rounded p-4 shadow-sm hover:border-[#f03846] transition-shadow duration-200 w-60 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-contain mb-2 rounded"
        />
        <h2 className="text-md font-semibold mb-1">{product.title}</h2>
        <p className="text-gray-700 text-lg">${product.price.toFixed(2)}</p>

        <div
          className="absolute bottom-2 right-2 z-50"
          onClick={(e) => {
            e.stopPropagation();
            handleCartToggle();
          }}
        >
          <FaShoppingCart
            size={24}
            className={`transition-colors duration-200 ${
              isAddedToCart ? 'text-[#f03846]' : 'text-gray-500'
            }`}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Login Required"
        message="Please Sign In to add items to your cart."
      />
    </>
  );
};

export default ProductCard;