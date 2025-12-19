/**
 * File validation utilities for secure file uploads
 */

// Allowed MIME types for images
const ALLOWED_IMAGE_MIMES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// File size limits (in bytes)
const MAX_THUMBNAIL_SIZE = 2000000; // 2MB
const MAX_AVATAR_SIZE = 500000; // 500KB

/**
 * Validates file MIME type
 * @param {Object} file - File object from express-fileupload
 * @returns {boolean} - True if valid
 */
const validateMimeType = (file) => {
    if (!file || !file.mimetype) {
        return false;
    }
    return ALLOWED_IMAGE_MIMES.includes(file.mimetype.toLowerCase());
};

/**
 * Validates file extension
 * @param {string} filename - File name
 * @returns {boolean} - True if valid
 */
const validateExtension = (filename) => {
    if (!filename) return false;
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return ALLOWED_EXTENSIONS.includes(ext);
};

/**
 * Validates file size
 * @param {Object} file - File object
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} - True if valid
 */
const validateFileSize = (file, maxSize) => {
    if (!file || !file.size) return false;
    return file.size <= maxSize;
};

/**
 * Validates image file (MIME type, extension, and size)
 * @param {Object} file - File object
 * @param {number} maxSize - Maximum size in bytes
 * @returns {{valid: boolean, error: string|null}}
 */
const validateImageFile = (file, maxSize) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!validateMimeType(file)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' };
    }

    if (!validateExtension(file.name)) {
        return { valid: false, error: 'Invalid file extension. Only .jpg, .jpeg, .png, .gif, and .webp are allowed.' };
    }

    if (!validateFileSize(file, maxSize)) {
        const maxSizeMB = (maxSize / 1000000).toFixed(1);
        return { valid: false, error: `File size too large. Maximum size is ${maxSizeMB}MB.` };
    }

    return { valid: true, error: null };
};

/**
 * Validates thumbnail file
 * @param {Object} file - File object
 * @returns {{valid: boolean, error: string|null}}
 */
const validateThumbnail = (file) => {
    return validateImageFile(file, MAX_THUMBNAIL_SIZE);
};

/**
 * Validates avatar file
 * @param {Object} file - File object
 * @returns {{valid: boolean, error: string|null}}
 */
const validateAvatar = (file) => {
    return validateImageFile(file, MAX_AVATAR_SIZE);
};

module.exports = {
    validateImageFile,
    validateThumbnail,
    validateAvatar,
    validateMimeType,
    validateExtension,
    validateFileSize,
    MAX_THUMBNAIL_SIZE,
    MAX_AVATAR_SIZE
};

