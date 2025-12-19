{/* Post Details component of the frontend */}

import { React, useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { sanitizeHTML } from "../utils/sanitize";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(()=> {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false)
    }
    getPost();
  }, [id])

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="post-detail">
        <div className="container center">
          <p className="form__error-message">
            {error.response?.data?.message || 'Failed to load post. Please try again.'}
          </p>
          <Link to="/" className="btn primary" style={{ marginTop: '1rem' }}>Go Back Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="post-detail">
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
            {currentUser?._id == post?.creator && (
              <div className="post-detail__buttons">
                <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id}/>
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail__thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
          </div>
          <div dangerouslySetInnerHTML={{__html: sanitizeHTML(post.description)}}></div>
        </div> 
      )}
    </section>
  );
};

export default PostDetail;
