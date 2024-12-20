import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CartPage from './pages/Customer/Cart';
import SignIn from './pages/Customer/SignIn';
import SignUp from './pages/Customer/SignUp';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import CartProvider from './context/CartContext';
import UnauthorizedPage from './pages/Unauthorized';
import CheckoutPage from './pages/Customer/Checkout';
import Order from './pages/Seller/Order';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </CartProvider>
  );
};

export default App;