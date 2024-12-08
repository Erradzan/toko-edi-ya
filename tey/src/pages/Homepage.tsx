import React, { useEffect, useState, useMemo } from 'react';
import { getProducts } from '../services/Api';
import type { Product } from '../services/Api';
import ProductCard from '../components/Productcard';
import Modal from '../components/Modal';
import withTheme from '../hocs/withTheme';
import ProductFilter from '../components/Productfilter';

interface HomePageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ isDarkMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortChange, setSortChange] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  useEffect(() => {
    const fetchAndSortProducts = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const productsData = await getProducts();
        const sortedProducts = [...productsData].sort((a, b) => {
          if (sortChange === 'priceAsc') {
            return a.price - b.price;
          } else if (sortChange === 'priceDesc') {
            return b.price - a.price;
          } else {
            return 0;
          }
        });
  
        setProducts(sortedProducts);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndSortProducts();
  }, [sortChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortChange(e.target.value);
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearchTerm = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMinPrice =
        minPrice === '' || product.price >= parseFloat(minPrice);
      const matchesMaxPrice =
        maxPrice === '' || product.price <= parseFloat(maxPrice);

      return (
        matchesCategory &&
        matchesSearchTerm &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [products, selectedCategory, searchTerm, minPrice, maxPrice]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container max-w-full mx-auto p-4 pt-[100px]">
        <ProductFilter
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          minPrice={minPrice}
          maxPrice={maxPrice}
          isDarkMode={isDarkMode}
          sortChange={sortChange}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onSortChange={handleSortChange}
        />

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleOpenModal(product)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <label htmlFor="itemsPerPage" className="mr-2">
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded p-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`p-2 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedProduct && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default withTheme(HomePage);