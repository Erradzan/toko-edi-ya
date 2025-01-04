import React from 'react';

interface ProductFilterProps {
  selectedCategory: string;
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  isDarkMode: boolean;
  sortChange: string;
  statusChange: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategory,
  searchTerm,
  minPrice,
  maxPrice,
  isDarkMode,
  statusChange,
  sortChange,
  onCategoryChange,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onStatusChange,
  onClearFilters,
}) => {
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Electronic', label: 'Electronic' },
    { value: 'Home & Supply', label: 'Home & Supply' },
  ];

  const sortOptions = [
    { value: 'none', label: 'None' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
  ];

  const status = [
    { value: 'all', label: 'All' },
    { value: 'secondhand', label: 'Secondhand' },
    { value: 'handmade', label: 'Handmade' },
  ];

  const isFiltersActive =
  selectedCategory !== 'all' ||
  searchTerm.trim() !== '' ||
  minPrice.trim() !== '' ||
  maxPrice.trim() !== '' ||
  sortChange !== 'none' ||
  statusChange !== 'all';

  return (
    <div
      className={`flex flex-col space-y-4 mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      {/* Filter Inputs */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search..."
          className={`p-2 rounded border ${
            isDarkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'border-gray-300'
          } w-72`}
        />

        <input
          type="number"
          value={minPrice}
          onChange={onMinPriceChange}
          placeholder="Min Price"
          className={`p-2 rounded border ${
            isDarkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'border-gray-300'
          } w-40`}
        />

        <input
          type="number"
          value={maxPrice}
          onChange={onMaxPriceChange}
          placeholder="Max Price"
          className={`p-2 rounded border ${
            isDarkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'border-gray-300'
          } w-40`}
        />

        <select
          value={sortChange}
          onChange={onSortChange}
          className={`p-2 rounded border ${
            isDarkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'border-gray-300'
          }`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={statusChange}
          onChange={onStatusChange}
          className={`p-2 rounded border ${
            isDarkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'border-gray-300'
          }`}
        >
          {status.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
          
        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          disabled={!isFiltersActive} // Disable button when no filters are active
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isFiltersActive
              ? 'bg-red-500 text-white cursor-pointer'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Clear All Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.value}
            aria-pressed={selectedCategory === category.value}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              selectedCategory === category.value
                ? 'bg-[#40b446] text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() =>
              onCategoryChange({ target: { value: category.value } } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;