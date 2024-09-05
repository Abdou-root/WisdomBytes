# Welcome to the Wisdom Bytes Documentation

This repository contains the source code and description of the MERN based blog platform. Visit at [WisdomBytes](google.dz)

## Overview

WisdomBytes is built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to blog seamlessly with a friendly interface. It comprises CRUD functionalities as well as manage user authentication and authorization. The platform features a responsive frontend with components for managing posts, categories, and user interactions, along with a backend that handles data management and API routing.

## File Structure

### Client Side

#### `/src/components/`

- **Footer.jsx**
  - **Description:** This component displays the footer of the application, containing category links for navigating to posts by category and a copyright notice.
  - **Key Features:**
    - Links to post categories (e.g., AI, Frontend, Git, etc.)
    - Copyright notice with the author's name.

- **Header.jsx**
  - **Description:** The header component manages the site's navigation bar and includes logic for retrieving and applying a theme from local storage, allowing users to switch the background theme of the application.

- **Layout.jsx**
  - **Description:** This component is used as the main layout wrapper for the application, ensuring consistent structure across different pages.

- **Loader.jsx**
  - **Description:** A simple loading spinner component that is displayed while data is being fetched or an operation is in progress.

- **PostAuthor.jsx**
  - **Description:** This component fetches and displays information about the author of a specific post, including the author's ID and the post creation date.
  - **Key Features:**
    - Fetches author data from the backend using the author's ID.
    - Displays the author’s name and the post's creation date.

- **PostItem.jsx**
  - **Description:** Displays a summary of a single post, including its title, description, author, and thumbnail.
  - **Key Features:**
    - Shortens descriptions and titles for display purposes.
    - Includes thumbnail images for posts.

- **Posts.jsx**
  - **Description:** Fetches and displays a list of posts from the backend.
  - **Key Features:**
    - Retrieves posts from the server.
    - Displays posts in a list format.
    - Manages loading states during data fetching.

#### `/src/context/`

- **userContext.js**
  - **Description:** Manages the current user context throughout the application.
  - **Key Features:**
    - Fetches the current user from the backend using an HTTP-only cookie.
    - Provides user data to the entire application.
    - Displays a loader while the user data is being fetched.

#### `/src/pages/`

- **index.css**
  - **Description:** Contains the global styles for the web application, including layout, typography, and component styles.

- **index.js**
  - **Description:** The entry point of the React application, responsible for rendering the app and setting up the application environment.

### Server Side

#### `/controllers/`

##### `/postControllers.js`

- **Description:** This file contains the logic for handling post-related operations on the server side.
- **Functions:**
  - **createPost:** Handles the creation of new posts. It validates input, manages file uploads for thumbnails, and updates the user's post count.
  - **getPosts:** Fetches all posts from the database, sorted by the latest update.
  - **getPost:** Retrieves a single post by its ID.
  - **getCatPosts:** Fetches posts belonging to a specific category.
  - **getUserPosts:** Retrieves all posts authored by a specific user.
  - **editPost:** Allows a user to edit an existing post, including updating the post's thumbnail.
  - **deletePost:** Handles the deletion of a post and its associated thumbnail, and updates the user's post count.

##### `/userControllers.js`

- **Description:** This file contains the logic for managing user-related operations, including authentication and email verification.
- **Functions:**
  - **sendOtpVerificationEmail:** Sends an OTP to the user's email for account verification using Nodemailer.
  - **registerUser:** Handles user registration, including input validation, password hashing, and sending OTP for email verification.
  - **loginUser:** Handles user authentication using the user's email and password. Uses an http-only cookie to avoid XSS attacks and store the JWT.
  - **getUser:** Fetches a user using a userID.
  - **getCurrent:** Fetches the current user.
  - **editUser/changeAvatar:** Handle user profile operations.
  - **verifyOTP:** Verifies the OTP provided by the user during account verification. It checks if the OTP is valid and not expired.

## Contribution & Setup

All contributions are welcome, below is how you can setup the project.

### Prerequisites

- Node.js
- MongoDB
- React
- Express

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/Abdou-root/WisdomBytes
   ```

2. Install server-side dependencies.

   ```bash
   cd server
   npm install
   ```

3. Install client-side dependencies.

   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables.
   - Create a `.env` file in the `server` directory.
   - Add the following variables:

     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     AUTH_EMAIL=your_email
     AUTH_PASS=your_email_password
     REACT_APP_BASE_URL=http://localhost:3000/api (or the port you choose)
     ```
5. Set up environment variables. (client side .env)
   - Create a `.env` file in the `client` directory.
   - Add the following variables:
     ```
     REACT_APP_BASE_URL=http://localhost:5000/api (or the port you choose to run it on)
     REACT_APP_ASSETS_URL=http://localhost:5000
     ```

### Running the Application

1. Start the server.

   ```bash
   cd server
   npm run dev
   ```

2. Start the client.

   ```bash
   cd ../client
   npm start
   ```

3. Access the application at `http://localhost:3000`.

## API Endpoints

### Posts API

- **Create Post:** `POST /api/posts` - Creates a new post (Protected)
- **Get All Posts:** `GET /api/posts` - Fetches all posts
- **Get Post:** `GET /api/posts/:id` - Fetches a single post by ID
- **Get Posts By Category:** `GET /api/posts/categories/:category` - Fetches posts by category
- **Get Posts By Author:** `GET /api/posts/users/:id` - Fetches posts by author ID
- **Edit Post:** `PATCH /api/posts/:id` - Edits a post (Protected)
- **Delete Post:** `DELETE /api/posts/:id` - Deletes a post (Protected)

### User API

- **Register User:** `POST /api/users/register` - Registers a new user
- **Login User:** `POST /api/users/login` - Login an existing user
- **Verify OTP:** `POST /api/users/verifyOTP` - Verifies user email with OTP

## Additional Notes

- **Theme Management:** The application supports theme management, where users can change the background theme, and the chosen theme is persisted in local storage.
- **File Uploads:** Thumbnails for posts are managed using the `fs` module, and file uploads are handled on the server side.

---

This documentation should give you a solid foundation to expand upon as needed. It covers the main components, server-side logic, and usage instructions.
