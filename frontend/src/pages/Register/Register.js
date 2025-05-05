import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";


const RegisterForm = () => {
  const navigate = useNavigate();

  const [skinTypes, setSkinTypes] = useState([]);
  const [skinTones, setSkinTones] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/skintypes")
      .then((res) => res.json())
      .then((data) => setSkinTypes(data));

    fetch("http://127.0.0.1:5000/skintones")
      .then((res) => res.json())
      .then((data) => setSkinTones(data));
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    skinType: "",
    skinColor: "",
    allergens: "",
    userAgreement: false,
  });

  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
    mandatory: false,
  });

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    let isValid = true;
    const newErrors = { password: false, confirmPassword: false, mandatory: false };
  
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = true;
      isValid = false;
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
      isValid = false;
    }
  
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.skinType ||
      !formData.skinColor ||
      !formData.userAgreement
    ) {
      newErrors.mandatory = true;
      isValid = false;
    }
  
    setErrors(newErrors);
  
    if (isValid) {
      const payload = {
        email: formData.email,
        password: formData.password,
        skin_type_id: parseInt(formData.skinType),
        skin_tone_id: parseInt(formData.skinColor),
        allergens: formData.allergens
          ? formData.allergens.split(',').map(item => item.trim())
          : [],
      };
      
  
      fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message); });
          }
          return res.json();
        })
        .then(data => {
          console.log("Register success:", data);
          navigate("/RegisterVerification");
        })
        .catch(err => {
          console.error("Register failed:", err.message);
          alert(`Registration failed: ${err.message}`);
        });
    }
  };
  

  return (
    <div className="container">
      <div className="register-form">
        <h2 className="logo">Glow Genie</h2>
        <form onSubmit={handleSubmit}>
          <label>E-mail*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="error-text">
              Password must contain at least one uppercase letter, lowercase
              letter, one number, and one special character.
            </p>
          )}

          <label>Confirm Password*</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="error-text">Passwords don’t match.</p>
          )}

          <label>Skin Type*</label>
          <div className="radio-group">
            {skinTypes.map((type) => (
              <label key={type.id} className="radio-option">
                <input
                  type="radio"
                  name="skinType"
                  value={type.id}
                  checked={parseInt(formData.skinType) === type.id}
                  onChange={handleChange}
                />
                {type.name}
              </label>
            ))}
          </div>  

          <label>Skin Color*</label>
          <div className="radio-group">
            {skinTones.map((tone) => (
              <label key={tone.id} className="radio-option">
                <input
                  type="radio"
                  name="skinColor"
                  value={tone.id}
                  checked={parseInt(formData.skinColor) === tone.id}
                  onChange={handleChange}
                />
                {tone.name}
              </label>
            ))}
          </div>

          <label>Allergenic Content</label>
          <input
            type="text"
            name="allergens"
            placeholder="Enter allergens"
            value={formData.allergens}
            onChange={handleChange}
          />
          <p className="error-text">
            Please enter the allergens in the desired form. Such as Paraben,
            Alcohol, etc.
          </p>

          <label>
            <input
              type="checkbox"
              name="userAgreement"
              checked={formData.userAgreement}
              onChange={handleChange}
              required
            />
            User Agreement*
          </label>

          <div className="button-group">
        <button type="submit" className="form-btn">
          Submit
        </button>
        <button
          type="button"
          className="form-btn"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>

          {errors.mandatory && (
            <p className="error-text">Please fill in the mandatory areas.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
