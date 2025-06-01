import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage/HomePage'; 
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import RegisterVerification from './pages/RegisterVerification/RegisterVerification';
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';
import SkinTypeTest from './pages/SkinTypeTest/SkinTypeTest';
import Register from './pages/Register/Register';
import ProductPage from './pages/ProductPage/ProductPage';
import RightForMe from './components/RightForMe';
import Navbar from './components/Navbar'; 
import './pages/SkinTypeTest/SkinTypeTest.css';
import './components/RightForMe.css';
import './index.css';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const hideNavbarPaths = [
    '/skin-type-test',
    '/update-password',
    '/forgot-password',
    '/register-verification',
    '/register',
    '/product-right-for-me'
  ];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Ana sayfa */}
      <Route path="/home-page" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register-verification" element={<RegisterVerification />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/skin-type-test" element={<SkinTypeTest />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product-page" element={<ProductPage />} />
      <Route path="/product-right-for-me" element={<RightForMe />} />
    </Routes>

    </>
  );
}

export default App;
