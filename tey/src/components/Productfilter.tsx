import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductFilterProps {
  selectedCategory: string;
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  isDarkMode: boolean;
  sortChange: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategory,
  searchTerm,
  minPrice,
  maxPrice,
  isDarkMode,
  sortChange,
  onCategoryChange,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange
}) => {
  const { state } = useCart();
  const navigate = useNavigate();
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleCartIconClick = () => {
    navigate('/cart');
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'jewelery', label: 'Jewelery' },
    { value: "men's clothing", label: "Men's Clothing" },
    { value: "women's clothing", label: "Women's Clothing" }
  ];

  const sortOptions = [
    { value: 'none', label: 'None' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' }
  ];

  return (
    <div
      className={`flex flex-col space-y-4 mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search..."
          className={`p-2 rounded border ${
            isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'border-gray-300'
          } w-72`}
        />
        <input
          type="number"
          value={minPrice}
          onChange={onMinPriceChange}
          placeholder="Min Price"
          className={`p-2 rounded border ${
            isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'border-gray-300'
          } w-40`}
        />
        <input
          type="number"
          value={maxPrice}
          onChange={onMaxPriceChange}
          placeholder="Max Price"
          className={`p-2 rounded border ${
            isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'border-gray-300'
          } w-40`}
        />
        <select
          value={sortChange}
          onChange={onSortChange}
          className={`p-2 rounded border ${
            isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'border-gray-300'
          } w-45`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <FaShoppingCart
            size={36}
            className={`transition-colors duration-200 cursor-pointer ${
              cartItemCount > 0 ? 'text-[#f03846]' : 'text-gray-500'
            }`}
            onClick={handleCartIconClick}
          />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartItemCount}
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex flex-wrap gap-2 p-2 rounded border ${
          isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'border-gray-300'
        }`}
      >
        {categories.map((category) => (
          <button
            key={category.value}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              selectedCategory === category.value
                ? 'bg-[#40b446] text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => {
              const event = {
                target: { value: category.value }
              } as React.ChangeEvent<HTMLSelectElement>;
              onCategoryChange(event);
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;