import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import withTheme from '../hocs/withTheme';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface ProfileProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
          });
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (!userProfile) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <img src={userProfile.avatar} alt="User Avatar" className="w-32 h-32 rounded-full mb-4" />
      <h1 className="text-4xl font-bold mb-4">{userProfile.name}</h1>
      <p className="text-xl mb-2">{userProfile.email}</p>
      <p className="text-lg mb-4">{userProfile.role}</p>
      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white py-2 px-4 rounded mb-4"
      >
        Delete Account
      </button>
      <button
        onClick={logout}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default withTheme(Profile);