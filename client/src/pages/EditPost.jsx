{/* Editing Post component of the frontend */}

import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader"
import { UserContext } from "../context/userContext";
import axios from "axios";
import { validateTitle, validateDescription } from "../utils/validation";
import { quillModules, quillFormats, POST_CATEGORIES } from "../utils/reactQuillConfig";
const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();
  const {id} = useParams();


  const { currentUser } = useContext(UserContext);

  // redirect to login page for any user with null token
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(()=> {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setTitle(response.data.title);
        setDescription(response.data.description);        
      } catch (error) {
        console.log(error)
      }
    }

    getPost();
  }, [id])
  
  if (!currentUser) {
    return <Loader/>;
  }

  const editPost = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate fields
    const titleValidation = validateTitle(title);
    const descriptionValidation = validateDescription(description);
    const newFieldErrors = {};

    if (!titleValidation.valid) {
      newFieldErrors.title = titleValidation.message;
    }
    if (!descriptionValidation.valid) {
      newFieldErrors.description = descriptionValidation.message;
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsSubmitting(false);
      return;
    }

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    if (thumbnail) {
      postData.set("thumbnail", thumbnail);
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        postData,
        { withCredentials: true }
      );
      if(response.status === 200) {
        return navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post </h2>
        {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={editPost}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) {
                  const validation = validateTitle(e.target.value);
                  setFieldErrors(prev => ({
                    ...prev,
                    title: validation.valid ? undefined : validation.message
                  }));
                }
              }}
              className={fieldErrors.title ? 'error' : ''}
              autoFocus
            />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </div>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <div>
          <ReactQuill
            modules={quillModules}
            formats={quillFormats}
            value={description}
              onChange={(value) => {
                setDescription(value);
                if (fieldErrors.description) {
                  const validation = validateDescription(value);
                  setFieldErrors(prev => ({
                    ...prev,
                    description: validation.valid ? undefined : validation.message
                  }));
                }
              }}
            />
            {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
          </div>
          <div>
            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="png, jpg, jpeg"
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--color-gray-500)' }}>
              Leave empty to keep current thumbnail
            </small>
          </div>
          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
