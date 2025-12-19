{/* Post controllers backend */}

const Post = require('../models/postModel')
const User = require('../models/userModel')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')
const { validateThumbnail } = require('../utils/fileValidation')
const cloudinary = require('../config/cloudinary')

//============== Create Post =============//
// POST: api/posts
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;
        if (!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all fields and choose thumbnail", 422))
        }
        const { thumbnail } = req.files;
        
        // Validate thumbnail file
        const thumbnailValidation = validateThumbnail(thumbnail);
        if (!thumbnailValidation.valid) {
            return next(new HttpError(thumbnailValidation.error, 422))
        }

        // Upload to Cloudinary
        try {
            const uploadOptions = {
                folder: 'wisdombytes/posts',
                public_id: `post_${uuid()}`,
                resource_type: 'auto'
            };
            
            let uploadResult;
            if (thumbnail.tempFilePath) {
                // File was saved to temp directory
                uploadResult = await cloudinary.uploader.upload(thumbnail.tempFilePath, uploadOptions);
            } else {
                // File is in memory as buffer - use upload_stream
                uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                    uploadStream.end(thumbnail.data);
                });
            }

            const newPost = await Post.create({ 
                title, 
                category, 
                description, 
                thumbnail: uploadResult.secure_url, 
                creator: req.user.id 
            });
            
            if (!newPost) {
                return next(new HttpError("Post couldn't be created", 422))
            }
            
            // fetch user and increment post count
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser.posts + 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })

            res.status(201).json(newPost)
        } catch (uploadError) {
            return next(new HttpError("File upload failed: " + uploadError.message, 422))
        }
    } catch ({ error }) {
        return next(new HttpError(error))
    }
}



//============== Get All Posts =============//
// GET: api/posts
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Get a Post =============//
// GET: api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post Not Found", 404))
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Get Posts By Category =============//
// GET: api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Get Posts By Author =============//
// GET: api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Edit Post =============//
// PATCH: api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all fields", 422))
        }
        // get old post from db
        const oldPost = await Post.findById(postId);
        if (req.user.id == oldPost.creator) {
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true })
            } else {
                const { thumbnail } = req.files;
                // Validate thumbnail file
                const thumbnailValidation = validateThumbnail(thumbnail);
                if (!thumbnailValidation.valid) {
                    return next(new HttpError(thumbnailValidation.error, 422))
                }
                
                try {
                    // Delete old thumbnail from Cloudinary if it exists
                    if (oldPost.thumbnail && oldPost.thumbnail.includes('cloudinary.com')) {
                        const publicId = oldPost.thumbnail.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(`wisdombytes/posts/${publicId}`).catch(err => {
                            console.log('Error deleting old thumbnail:', err);
                        });
                    }
                    
                    // Upload new thumbnail to Cloudinary
                    const uploadOptions = {
                        folder: 'wisdombytes/posts',
                        public_id: `post_${uuid()}`,
                        resource_type: 'auto'
                    };
                    
                    let uploadResult;
                    if (thumbnail.tempFilePath) {
                        uploadResult = await cloudinary.uploader.upload(thumbnail.tempFilePath, uploadOptions);
                    } else {
                        uploadResult = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            });
                            uploadStream.end(thumbnail.data);
                        });
                    }
                    
                    updatedPost = await Post.findByIdAndUpdate(postId, { 
                        title, 
                        category, 
                        description, 
                        thumbnail: uploadResult.secure_url 
                    }, { new: true });
                } catch (uploadError) {
                    return next(new HttpError("File upload failed: " + uploadError.message, 422))
                }
            }
        }
        if (!updatedPost) {
            return next(new HttpError("Couldn't update post", 422))
        }
        res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Delete Post =============//
// DELETE: api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post Unavailable", 400))
        }
        const post = await Post.findById(postId);

        if (req.user.id == post.creator) {
            try {
                // Delete thumbnail from Cloudinary if it exists
                if (post.thumbnail && post.thumbnail.includes('cloudinary.com')) {
                    const publicId = post.thumbnail.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`wisdombytes/posts/${publicId}`).catch(err => {
                        console.log('Error deleting thumbnail:', err);
                    });
                }
                
                await Post.findByIdAndDelete(postId);
                // reduce user posts count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser?.posts - 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                res.status(200).json(`Post ${postId} deleted successfully`);
            } catch (error) {
                return next(new HttpError("Error deleting post: " + error.message, 500))
            }
        } else {
            return next(new HttpError("Post couldn't be deleted", 403))
        }

    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {
    createPost,
    getPosts,
    getPost,
    getCatPosts,
    getUserPosts,
    editPost,
    deletePost
}