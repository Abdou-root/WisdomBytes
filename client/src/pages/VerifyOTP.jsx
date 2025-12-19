{/* Verify OTP component of the frontend */}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setOtp(e.target.value);
  };
  const userId = localStorage.getItem("userId");

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    if (!otp) {
      setError("Please enter the OTP code");
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      setError("User ID not found. Please register again.");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/verifyOTP`,
        { userId, otp }
      );
      const result = response.data;

      if (result.status === "Verified") {
        setMessage(result.message);
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Verify OTP</h2>
        <form className="form register__form" onSubmit={verifyOtp}>
          {error && <p className="form__error-message">{error}</p>}
          {message && <p className="form__success-message">{message}</p>}
          <input
            type="text"
            placeholder="Enter OTP"
            name="otp"
            value={otp}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <small style={{ marginTop: '1rem', display: 'block' }}>
          Didn't receive the code? <Link to="/register">Register again</Link> or contact support.
        </small>
      </div>
    </section>
  );
};

export default VerifyOTP;
