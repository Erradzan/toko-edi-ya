import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Modal from './Modal';
import ModalLogin from './Modal-login';

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

interface ProductCardProps {
  product: Product;
  isDarkMode: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isDarkMode }) => {
  const { state, addItem, removeItem } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsSeller(userRole === 'seller');

    const isProductInCart = state.items.some((item) => item.ID === product.ID);
    setIsAddedToCart(isProductInCart);
  }, [state.items, product.ID]);

  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    const cartItem: CartItem = { ...product, quantity: 1 };
    if (isAddedToCart) {
      removeItem(cartItem);
    } else {
      addItem(cartItem);
    }
    setIsAddedToCart(!isAddedToCart);
  };

  const handleCardClick = () => {
    setIsProductModalOpen(true);
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(product.price);

  const rating = product.rating !== null ? product.rating : 0;

  return (
    <>
      <div
        className={`relative border ${isDarkMode ? 'bg-[#888888]' : 'bg-white'} border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300 w-70 cursor-pointer`}
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-contain mb-3 rounded-lg bg-gray-100"
        />
        <h2 className={`text-lg font-semibold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-[#888888]'}`} title={product.title}>
          {product.title}
        </h2>
        <p className={`text-gray-600 text-base mb-1 ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{formattedPrice}</p>
        <p className={`text-gray-500 text-sm ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.status}</p>
        <p className={`text-gray-500 text-sm ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>{product.seller}</p>
        <p className={`text-gray-500 text-sm ${isDarkMode ? 'text-white' : 'text-[#888888]'}`}>Rating: {rating}/5</p>
    
        {!isSeller && (
          <button
            className="absolute bottom-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-[#f03846] transition-colors duration-200"
            onClick={handleCartToggle}
            aria-label={isAddedToCart ? 'Remove from cart' : 'Add to cart'}
          >
            <FaShoppingCart
              size={24}
              className={`transition-colors duration-200 ${
                isAddedToCart ? 'text-white' : 'text-gray-700'
              }`}
            />
            <span
              className="absolute -top-3 -right-3 bg-[#f03846] text-white text-xs font-bold rounded-full px-1.5 py-0.5"
              style={{ display: isAddedToCart ? 'block' : 'none' }}
            >
              ✓
            </span>
          </button>
        )}
      </div>
    
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={product}
      />
    
      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login Required"
        message="Please Sign In to add items to your cart."
      />
  </>
  );
};

export default ProductCard;