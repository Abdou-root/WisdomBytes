{/* Logout component of the frontend */}

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/Loader'
import axios from 'axios';

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/users/logout`, {}, { withCredentials: true });
        setCurrentUser(null);
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    performLogout();
  }, [setCurrentUser, navigate]);

  return <Loader/>;  
};

export default Logout;
