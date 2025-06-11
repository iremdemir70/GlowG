import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import OptionsPanel from '../../components/OptionsPanel/OptionsPanel';
import SkinTypePopup from '../../components/SkinTypePopup/SkinTypeTestPopup';
import LoginForm from '../../components/LoginForm/LoginForm';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import './HomePage.css';

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinTones, setSkinTones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const togglePopup = () => setShowPopup(prev => !prev);

  const goToHomePage = () => navigate('/');
  const goToQuiz = () => navigate('/skin-type-test');
  const goToRightForMe = () => navigate('/product-right-for-me');
  const goToSuggestPage = () => navigate('/suggest-page');

const onLoginSuccess = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("isLoggedIn", "true");
  setIsLoggedIn(true);
  setShowPopup(false);
  alert("Login Successful!");

  fetch("http://127.0.0.1:5000/profile", {
    headers: { Authorization: `Bearer ${data.token}` }
  })
    .then(res => res.json())
    .then(profileData => {
      setUserData(profileData);
    })
    .catch(err => {
      console.error("Failed to fetch user profile after login:", err);
    });
};


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem("token");
    const loginStatus = localStorage.getItem("isLoggedIn");

    if (token && loginStatus === "true") {
      setIsLoggedIn(true);

      fetch("http://127.0.0.1:5000/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Token expired or invalid");
          return res.json();
        })
        .then(data => {
          setUserData(data);
        })
        .catch(err => {
          console.error("User data fetch failed:", err);
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          setShowPopup(true);
        });
    } 
    //else {
     // setShowPopup(true);
    //}

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/skin-types")
      .then(res => res.json())
      .then(data => setSkinTypes(data))
      .catch(err => console.error("Skin types fetch failed", err));

    fetch("http://127.0.0.1:5000/skin-tones")
      .then(res => res.json())
      .then(data => setSkinTones(data))
      .catch(err => console.error("Skin tones fetch failed", err));
  }, []);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const verifiedStatus = params.get("verified");

  if (verifiedStatus === "true") {
    alert("✅ Email doğrulaması başarılı! Giriş yapabilirsiniz.");
  } else if (verifiedStatus === "expired") {
    alert("❌ Doğrulama bağlantısının süresi dolmuş.");
  } else if (verifiedStatus === "invalid") {
    alert("❌ Geçersiz doğrulama bağlantısı.");
  } else if (verifiedStatus === "false") {
    alert("❌ Kullanıcı bulunamadı.");
  }
  }, [location]);

  const updateProfile = (updatedProfile) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again.");
      return;
    }

    fetch("http://127.0.0.1:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedProfile)
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(data => {
        alert("✅ Profile updated successfully!");
        setUserData(data.updated_profile || data);
        setIsEditing(false);
      })
      .catch(err => {
        console.error("❌ Profile update failed:", err);
        alert("❌ Failed to update profile");
      });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
  };

return (
  <div className="container"> {/* Burada dış container eklenmeli */}
    <Navbar
      isScrolled={isScrolled}
      menuOpen={menuOpen}
      toggleMenu={toggleMenu}
      goToHomePage={goToHomePage}
    />

    <header><br /><br /></header>

    <main>
      <OptionsPanel
        isLoggedIn={isLoggedIn}
        goToQuiz={goToQuiz}
        goToRightForMe={goToRightForMe}
        goToSuggest={goToSuggestPage}
        setShowPopup={setShowPopup}
      />

      {showPopup && (
        <SkinTypePopup
          goToHomePage={goToHomePage}
          goToQuiz={goToQuiz}
          onClose={togglePopup}
        />
      )}

      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <ProfileCard
          email={userData?.email}
          profile={userData}
          skinTypes={skinTypes}
          skinTones={skinTones}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateProfile={updateProfile}
          handleLogout={logout}
        />
      )}
    </main>

    <div style={{ height: 1000 }} />
  </div>
);
};

export default HomePage;
