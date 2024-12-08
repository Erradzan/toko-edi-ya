import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    console.log('Token retrieved from storage:', token);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, rememberMe: boolean) => {
    setIsAuthenticated(true);
    if (rememberMe) {
      console.log('Storing token in localStorage:', token);
      localStorage.setItem('authToken', token);
      sessionStorage.removeItem('authToken');
    } else {
      console.log('Storing token in sessionStorage:', token);
      sessionStorage.setItem('authToken', token);
      localStorage.removeItem('authToken');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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