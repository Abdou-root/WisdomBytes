{/* Login component of the frontend */}

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { validateEmail } from "../utils/validation";

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {setCurrentUser} = useContext(UserContext);

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => {
      return { ...prevState, [name]: value };
    });

    // Real-time validation
    const newFieldErrors = { ...fieldErrors };
    if (name === 'email' && value && !validateEmail(value)) {
      newFieldErrors.email = 'Please enter a valid email address';
    } else if (name === 'email') {
      delete newFieldErrors.email;
    }
    if (name === 'password' && !value) {
      newFieldErrors.password = 'Password is required';
    } else if (name === 'password') {
      delete newFieldErrors.password;
    }
    setFieldErrors(newFieldErrors);
  };


  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate fields
    const newFieldErrors = {};
    if (!userData.email) {
      newFieldErrors.email = 'Email is required';
    } else if (!validateEmail(userData.email)) {
      newFieldErrors.email = 'Please enter a valid email address';
    }
    if (!userData.password) {
      newFieldErrors.password = 'Password is required';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = await response.data;
      setCurrentUser(user);
      navigate('/');
      // Removed window.location.reload() - let React handle the state update
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };
  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}
          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              className={fieldErrors.email ? 'error' : ''}
              autoFocus
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
          </div>
          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Register</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
