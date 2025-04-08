import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
const baseUrl = "http://localhost:5000";


const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${baseUrl}/register`, {
        email: formData.email,
        password: formData.password,
        skinType: formData.skinType,
        // diğer bilgiler...
      });
  
      console.log("Kayıt başarılı:", response.data);
    } catch (err) {
      console.error("Kayıt sırasında hata:", err.message);
    }
  };

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    allergens: "",
    skinType: "",
    skinColor: "",
    agreed: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

    if (!formData.email) newErrors.email = true;
    if (!passwordPattern.test(formData.password)) newErrors.password = true;
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = true;
    if (!formData.skinType) newErrors.skinType = true;
    if (!formData.skinColor) newErrors.skinColor = true;
    if (!formData.agreed) newErrors.agreed = true;

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form başarıyla gönderildi", formData);
      // API'ye gönderilebilir
      setErrors({});
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
              Password must contain uppercase, lowercase, number, and special character.
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
            {["Dry", "Normal", "Oily", "Combination", "Unknown"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="skinType"
                  value={type}
                  checked={formData.skinType === type}
                  onChange={handleChange}
                />
                {type} Skin
              </label>
            ))}
          </div>

          <label>Skin Color*</label>
          <div className="radio-group">
            {["Light", "Medium", "Dark"].map((color) => (
              <label key={color}>
                <input
                  type="radio"
                  name="skinColor"
                  value={color}
                  checked={formData.skinColor === color}
                  onChange={handleChange}
                />
                {color} Skin
              </label>
            ))}
          </div>

          <label>Allergenic Content</label>
          <input
            type="text"
            name="allergens"
            value={formData.allergens}
            onChange={handleChange}
            placeholder="Enter allergens"
          />
          <p className="error-text">
            Please enter allergens like Paraben, Alcohol, etc.
          </p>

          <label>
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              required
            />{" "}
            User Agreement*
          </label>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => window.location.href = "/"}
            >
              Cancel
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="error-text">Please fill in all mandatory areas correctly.</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
