import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage/ProductPage';
import Register from './pages/Register/Register';
import SkinTypeTest from './pages/SkinTypeTest/SkinTypeTest';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';
import RegisterVerification from './pages/RegisterVerification/RegisterVerification';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  // Bu path'lerde navbar gösterilmeyecek
  const hideNavbarPaths = [
    '/skin-type',
    '/update-password',
    '/forgot-password',
    '/register-verification'
  ];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/skin-type" element={<SkinTypeTest />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/register-verification" element={<RegisterVerification />} />
      </Routes>
    </>
  );
}

export default App;
