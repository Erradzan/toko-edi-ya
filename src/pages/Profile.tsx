import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import withTheme from '../hocs/withTheme';
import UpdateModal from '../components/UpdateModal';
import AddAddressModal from '../components/Modal-address';
import DiscountModal from '../components/Modal-discount';
import AddProductModal from '../components/Modal-product';
import axios from 'axios';

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  userName: string;
}

interface Transaction {
  Bank: string;
  Transaction_id: number;
  customer: string;
  date: string;
  order_products: {
    product_name: string;
    quantity: number;
    seller: string;
    sum_price: string;
  }[];
  payment_method: string | string[];
  status: string;
  total_price: string;
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

interface ProfileProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
  const { isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userIdArray = localStorage.getItem('userId');
        if (!token || !userIdArray) throw new Error('No token or userId found');
        const userId = Array.isArray(JSON.parse(userIdArray)) ? parseInt(JSON.parse(userIdArray)[0], 10) : 4;
        const response = await axios.get(`https://vicious-damara-gentaproject-0a193137.koyeb.app/userprofile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data?.data;
        const allAddresses = data.addresses.map((addressObj: { address: string }) => addressObj.address).join(', ') || 'No address provided';

        setUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          phoneNumber: data.phoneNumber,
          address: allAddresses,
          avatar: data.avatar_img_url,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const role = localStorage.getItem('userRole');
        if (role === 'seller') {
          const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/discounts');
          setDiscounts(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/product');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');
        if (role === 'customer') {
          const response = await axios.get('https://vicious-damara-gentaproject-0a193137.koyeb.app/historytransaction', {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
            });
          setTransactions(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchProducts();
    fetchUserProfile();
    fetchDiscounts();
    fetchTransactions();
  }, [isAuthenticated, navigate]);

  const customerTransactions = transactions.filter(
    (transaction) => transaction.customer === userProfile?.userName
  );

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userIdArray = localStorage.getItem('userId');
    if (role === 'seller' && userIdArray) {
      const userId = Array.isArray(JSON.parse(userIdArray)) ? parseInt(JSON.parse(userIdArray)[0], 10) : 4;
      const filtered = discounts.filter((discount: any) => discount.seller_id === userId);
      setFilteredDiscounts(filtered);
    }
  }, [discounts]);

  useEffect(() => {
    if (userProfile) {
      const userProducts = products.filter((product) => product.seller === userProfile.userName);
      setFilteredProducts(userProducts);
    }
  }, [products, userProfile]);

  if (!userProfile) {
    return <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenAddAddressModal = () => setIsAddAddressModalOpen(true);
  const handleCloseAddAddressModal = () => setIsAddAddressModalOpen(false);

  const handleOpenDiscountModal = () => setIsDiscountModalOpen(true);
  const handleCloseDiscountModal = () => setIsDiscountModalOpen(false);

  const handleOpenAddProductModal = () => setIsAddProductModalOpen(true);
  const handleCloseAddProductModal = () => setIsAddProductModalOpen(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-12`}>
      <div className="container mx-auto p-4">
        <div className={`flex flex-col md:flex-row items-center ${isDarkMode ? 'bg-gray-900 text-white border-white' : 'bg-white text-gray-900 border-black'} p-6 border-2 rounded-lg overflow-hidden`}>
          <div className="flex-none w-48 h-48 m-6">
            <img
              src={userProfile.avatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          </div>
          <div className="flex-grow p-6">
            <h2 className="text-2xl font-bold mb-4">
              {userProfile.firstName} {userProfile.lastName} "{userProfile.userName}"
            </h2>
            <p className="mb-2">
              <strong>Phone:</strong> {userProfile.phoneNumber}
            </p>
            <p className="mb-4">
              <strong>Address:</strong> {userProfile.address}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleOpenAddAddressModal}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Add Address
              </button>
              <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Update Info
              </button>
            </div>
          </div>
        </div>
  
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {localStorage.getItem('userRole') === 'seller' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Products</h3>
                <button
                  onClick={handleOpenAddProductModal}
                  className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
                >
                  Add Product
                </button>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div key={index} className="p-4 rounded-lg shadow-md">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-contain rounded-md mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      <p className="text-black">Price: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</p>
                      <p className="text-black">Stock: {product.stock_qty}</p>
                      <p className="text-black">Status: {product.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No products found.</p>
              )}
            </div>
          )}
  
          {localStorage.getItem('userRole') === 'seller' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Discounts</h3>
                <button
                  onClick={handleOpenDiscountModal}
                  className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600"
                >
                  Add Discount
                </button>
              </div>
              {filteredDiscounts.length > 0 ? (
                <ul className="space-y-4">
                  {filteredDiscounts.map((discount: any) => (
                    <li key={discount.id} className="p-4 rounded-lg">
                      <p>
                        <strong>Code:</strong> {discount.code}
                      </p>
                      <p>
                        <strong>Value:</strong>{' '}
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(parseFloat(discount.discount_value))}
                      </p>
                      <p>
                        <strong>Expires:</strong> {new Date(discount.expiration_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {discount.status}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No discounts found.</p>
              )}
            </div>
          )}
                  {localStorage.getItem('userRole') === 'customer' && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">Transaction History</h3>
            {customerTransactions.length > 0 ? (
              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-[#40b446]">
                    <th className="border px-4 py-2">Transaction ID</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Bank</th>
                    <th className="border px-4 py-2">Payment Method</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Products</th>
                    <th className="border px-4 py-2">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {customerTransactions.map((transaction) => (
                    <tr key={transaction.Transaction_id}>
                      <td className="border px-4 py-2">{transaction.Transaction_id}</td>
                      <td className="border px-4 py-2">{new Date(transaction.date).toLocaleString()}</td>
                      <td className="border px-4 py-2">{transaction.Bank}</td>
                      <td className="border px-4 py-2">
                        {Array.isArray(transaction.payment_method)
                          ? transaction.payment_method.join(', ')
                          : transaction.payment_method}
                      </td>
                      <td className="border px-4 py-2">{transaction.status}</td>
                      <td className="border px-4 py-2">
                        <ul>
                          {transaction.order_products.map((product, idx) => (
                            <li key={idx}>
                              {product.quantity}x {product.product_name} (Seller: {product.seller}) - {product.sum_price}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="border px-4 py-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(transaction.total_price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
            )}
          </div>
        )}
        </div>

        <AddProductModal isOpen={isAddProductModalOpen} onClose={handleCloseAddProductModal} />
        {isDiscountModalOpen && <DiscountModal isOpen={isDiscountModalOpen} onClose={handleCloseDiscountModal} />}
        {isModalOpen && <UpdateModal userProfile={userProfile} onClose={handleCloseModal} />}
        {isAddAddressModalOpen && (
          <AddAddressModal
            isOpen={isAddAddressModalOpen}
            onClose={handleCloseAddAddressModal}
            userId={parseInt(localStorage.getItem('userId') || '0', 10)}
          />
        )}
      </div>
    </div>
  );  
};

export default withTheme(Profile);