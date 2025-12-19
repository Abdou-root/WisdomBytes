{/* User registration component of the frontend */}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from "../utils/validation";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => {
      return { ...prevState, [name]: value };
    });

    // Real-time validation
    const newFieldErrors = { ...fieldErrors };
    
    if (name === 'name') {
      const nameValidation = validateName(value);
      if (!nameValidation.valid) {
        newFieldErrors.name = nameValidation.message;
      } else {
        delete newFieldErrors.name;
      }
    } else if (name === 'email') {
      if (value && !validateEmail(value)) {
        newFieldErrors.email = 'Please enter a valid email address';
      } else {
        delete newFieldErrors.email;
      }
    } else if (name === 'password') {
      const passwordValidation = validatePassword(value);
      setPasswordStrength(passwordValidation);
      if (!passwordValidation.valid) {
        newFieldErrors.password = passwordValidation.message;
      } else {
        delete newFieldErrors.password;
      }
      // Re-validate password match if password2 exists
      if (userData.password2) {
        const matchValidation = validatePasswordMatch(value, userData.password2);
        if (!matchValidation.valid) {
          newFieldErrors.password2 = matchValidation.message;
        } else {
          delete newFieldErrors.password2;
        }
      }
    } else if (name === 'password2') {
      const matchValidation = validatePasswordMatch(userData.password, value);
      if (!matchValidation.valid) {
        newFieldErrors.password2 = matchValidation.message;
      } else {
        delete newFieldErrors.password2;
      }
    }
    
    setFieldErrors(newFieldErrors);
  };
  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate all fields
    const nameValidation = validateName(userData.name);
    const emailValidation = userData.email ? validateEmail(userData.email) : { valid: false };
    const passwordValidation = validatePassword(userData.password);
    const passwordMatchValidation = validatePasswordMatch(userData.password, userData.password2);

    const newFieldErrors = {};
    if (!nameValidation.valid) newFieldErrors.name = nameValidation.message;
    if (!emailValidation) newFieldErrors.email = 'Email is required';
    if (!passwordValidation.valid) newFieldErrors.password = passwordValidation.message;
    if (!passwordMatchValidation.valid) newFieldErrors.password2 = passwordMatchValidation.message;

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = response.data;
      if (!newUser) {
        setError("Couldn't register user. Please try again");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem('userId', newUser.userId);
      navigate("/verifyOTP");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <div>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={userData.name}
              onChange={changeInputHandler}
              className={fieldErrors.name ? 'error' : ''}
              autoFocus
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              className={fieldErrors.password ? 'error' : ''}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            {passwordStrength && userData.password && (
              <div className={`password-strength ${passwordStrength.strength}`}>
                <span>Password strength: {passwordStrength.strength}</span>
              </div>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={userData.password2}
              onChange={changeInputHandler}
              className={fieldErrors.password2 ? 'error' : ''}
            />
            {fieldErrors.password2 && <span className="field-error">{fieldErrors.password2}</span>}
          </div>
          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <small>
          Already have an account? <Link to="login">Login</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;

