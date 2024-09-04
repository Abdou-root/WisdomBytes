{/* Verify OTP component of the frontend */}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setOtp(e.target.value);
  };
  const userId = localStorage.getItem("userId");

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    // retrieve 
    if (!userId) {
      setError("User ID not found. Please register again.");
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
      }
    } catch (err) {
      setError(err.response.data.message);
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
          <button type="submit" className="btn primary">
            Verify OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyOTP;
