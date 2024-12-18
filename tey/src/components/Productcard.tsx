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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
        className="relative border border-black rounded p-4 shadow-sm hover:border-[#f03846] transition-shadow duration-200 w-60 cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-contain mb-2 rounded"
        />
        <h2 className="text-md font-semibold mb-1 truncate" title={product.title}>
          {product.title}
        </h2>
        <p className="text-gray-700 text-lg">{formattedPrice}</p>
        <p className="text-gray-700 text-lg">{product.status}</p>
        <p className="text-gray-700 text-lg">{product.seller}</p>
        <p className="text-gray-700 text-lg">Rating: {rating}/5</p>

        {!isSeller && (
          <button
            className="absolute bottom-2 right-2 z-30 p-2"
            onClick={handleCartToggle}
            aria-label={isAddedToCart ? 'Remove from cart' : 'Add to cart'}
          >
            <FaShoppingCart
              size={24}
              className={`transition-colors duration-200 ${
                isAddedToCart ? 'text-[#f03846]' : 'text-gray-500'
              }`}
            />
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