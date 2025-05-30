import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './auth/ForgotPassword';
import RegisterVerification from './auth/RegisterVerification';
import UpdatePassword from './auth/UpdatePassword';
import SkinTypeTest from './components/SkinTypeTest'; 
import Register from './auth/Register'; 
import './components/SkinTypeTest.css'; 
import GlowGenieApp from './pages/GlowGenieApp';
import ProductPage from './components/ProductPage';
import RightForMe from './components/RightForMe';
import SuggestPage from './components/SuggestPage';
import './components/styles.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register-verification" element={<RegisterVerification />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/skin-type-test" element={<SkinTypeTest />} /> 
        <Route path="/register" element={<Register/>} /> 
        <Route path="/home-page" element={<GlowGenieApp />} />
        <Route path="/product-page" element={<ProductPage/>} /> 
        <Route path="/suggest-page" element={<SuggestPage/>} /> 
        <Route path="/product-right-for-me" element={<RightForMe/>} />
         
      </Routes>
    </Router>
  );
}

export default App;
