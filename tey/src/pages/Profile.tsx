import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import withTheme from '../hocs/withTheme';
import UpdateModal from '../components/UpdateModal';
import AddAddressModal from '../components/Modal-address';
import axios from 'axios';

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  avatar: string;
}

interface ProfileProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
  const { isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false); // New state for Add Address Modal
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        const data = response.data?.data;
        const allAddresses = data.addresses.map((addressObj: { address: string }) => addressObj.address).join(', ') || 'No address provided';
        
        setUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          address: allAddresses,
          avatar: 'https://via.placeholder.com/150',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  if (!userProfile) {
    return <p>Loading...</p>;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenAddAddressModal = () => setIsAddAddressModalOpen(true);
  const handleCloseAddAddressModal = () => setIsAddAddressModalOpen(false);

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="pt-16 flex justify-center items-start">
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg border-gray-300 dark:border-gray-700 max-w-4xl w-full mx-4 p-10">
          <div className="flex-none flex items-center justify-center mb-6 md:mb-0 md:mr-8">
            <img
              src={userProfile.avatar}
              alt="User Avatar"
              className="w-48 h-48 rounded-full border border-gray-300 dark:border-gray-600"
            />
          </div>
          <span className="md:w-16 hidden md:block" />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-4">
              {userProfile.firstName} {userProfile.lastName}
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
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Add Address
              </button>
              <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Update Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <UpdateModal userProfile={userProfile} onClose={handleCloseModal} />}
      {isAddAddressModalOpen && <AddAddressModal isOpen={isAddAddressModalOpen} onClose={handleCloseAddAddressModal} userId={parseInt(localStorage.getItem('userId') || '0', 10)} />}
    </div>
  );
};

export default withTheme(Profile);
