{/* Delete Post component of the frontend */}

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const DeletePost = ({ postId: id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  // redirect to login page for any user with null token
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const removePost = async () => {
    // Confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.response?.data?.message || 'Failed to delete post. Please try again.');
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <Loader/>
  }


  return (
    <Link className="btn sm danger" onClick={() => removePost(id)}>
      Delete
    </Link>
  );
};

export default DeletePost;
