import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/Productcard';
import withTheme from '../hocs/withTheme';
import ProductFilter from '../components/Productfilter';
import { ClipLoader } from 'react-spinners';
import Error from '../support/Error.png';
import Dark from '../support/Dark.png';
import Light from '../support/Light.png';

interface HomePageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

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

const HomePage: React.FC<HomePageProps> = ({ isDarkMode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortChange, setSortChange] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [statusChange, setStatusChange] = useState<string>('all');

  useEffect(() => {
    const fetchAndSortProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/product');
        const productsData = response.data.data;

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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusChange(e.target.value);
  };

  const onClearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortChange('none');
    setStatusChange('all');
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
      const matchesStatus = statusChange === 'all' || product.status === statusChange;

      return (
        matchesStatus &&
        matchesCategory &&
        matchesSearchTerm &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [products, selectedCategory, searchTerm, minPrice, maxPrice, statusChange]);

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
    <div
      className={`w-full min-h-screen ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
      style={{
        backgroundImage: `url(${isDarkMode ? Dark : Light})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container max-w-full mx-auto p-4 pt-[100px]">
        <ProductFilter
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          minPrice={minPrice}
          maxPrice={maxPrice}
          isDarkMode={isDarkMode}
          sortChange={sortChange}
          statusChange={statusChange}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onSortChange={handleSortChange}
          onStatusChange={handleStatusChange}
          onClearFilters={onClearFilters}
        />
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#3498db" loading={loading} size={50} />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {currentItems.length === 0 && searchTerm ? (
              <div className="text-center mt-10">
                <img
                  src={Error}
                  alt="No results"
                  className="w-64 mx-auto mb-4"
                />
                <p className="text-gray-600">No results found for "{searchTerm}".</p>
                <button
                  className="mt-4 bg-[#40b446] text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortChange('none');
                    setStatusChange('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {currentItems.map((product) => (
                    <ProductCard key={product.ID} product={product} isDarkMode={isDarkMode} />
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
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                      <option value={48}>48</option>
                    </select>
                  </div>
                  <div className="flex justify-center mt-6">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={currentPage === page}
                        className={`px-4 py-2 mx-1 rounded ${
                          currentPage === page
                            ? 'bg-[#40b446] text-white cursor-not-allowed'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );  
};

export default withTheme(HomePage);