import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: string | null;
  userId: number[];
  login: (token: string, role: string, user: { user_id: number }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [userId, setUserId] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRoleFromLocalStorage = localStorage.getItem('userRole');
    const userIdFromLocalStorage = localStorage.getItem('userId');
  
    if (token && userRoleFromLocalStorage && userIdFromLocalStorage) {
      try {
        const userIdArray = JSON.parse(userIdFromLocalStorage);
        if (Array.isArray(userIdArray) && userIdArray.every(id => typeof id === 'number')) {
          setUserId(userIdArray);
          setUserRole(userRoleFromLocalStorage);
          setIsAuthenticated(true);
        } else {
          console.error('Invalid userId format in localStorage');
        }
      } catch (error) {
        console.error('Failed to parse userId from localStorage:', error);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId([]);
    }
  }, []);  

  const login = (token: string, role: string, user: { user_id: number }) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);

    if (user) {
      localStorage.setItem('userId', JSON.stringify([user]));
      setUserId([user.user_id]);
    } else {
      console.error('User ID is not provided');
    }

    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId([]);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};