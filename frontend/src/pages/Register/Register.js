import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

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
      navigate("/RegisterVerification");
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
            {["Dry", "Normal", "Oily", "Combination", "Unknown"].map((type) => (
              <label key={type} className="radio-option">
                <input
                  type="radio"
                  name="skinType"
                  value={type}
                  checked={formData.skinType === type}
                  onChange={handleChange}
                />
                {type === "Unknown" ? "I don't know my skin type" : `${type} Skin`}
              </label>
            ))}
          </div>

          <label>Skin Color*</label>
          <div className="radio-group">
            {["Light", "Medium", "Dark"].map((color) => (
              <label key={color} className="radio-option">
                <input
                  type="radio"
                  name="skinColor"
                  value={color}
                  checked={formData.skinColor === color}
                  onChange={handleChange}
                />
                {`${color} Skin`}
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
