/**
 * Client-side validation utilities
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, strength: string, message: string}} - Validation result
 */
export const validatePassword = (password) => {
    if (!password) {
        return { valid: false, strength: 'weak', message: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, strength: 'weak', message: 'Password must be at least 8 characters' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strengthCount === 4) {
        return { valid: true, strength: 'strong', message: 'Strong password' };
    } else if (strengthCount === 3) {
        return { valid: true, strength: 'medium', message: 'Medium strength password' };
    } else {
        return { valid: true, strength: 'weak', message: 'Weak password - consider adding more character types' };
    }
};

/**
 * Validates name
 * @param {string} name - Name to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.trim().length > 50) {
        return { valid: false, message: 'Name must be less than 50 characters' };
    }
    return { valid: true, message: '' };
};

/**
 * Validates that two passwords match
 * @param {string} password - First password
 * @param {string} password2 - Second password
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export const validatePasswordMatch = (password, password2) => {
    if (!password2) {
        return { valid: false, message: 'Please confirm your password' };
    }
    if (password !== password2) {
        return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: '' };
};

/**
 * Validates post title
 * @param {string} title - Title to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export const validateTitle = (title) => {
    if (!title || title.trim().length === 0) {
        return { valid: false, message: 'Title is required' };
    }
    if (title.trim().length < 3) {
        return { valid: false, message: 'Title must be at least 3 characters' };
    }
    if (title.trim().length > 200) {
        return { valid: false, message: 'Title must be less than 200 characters' };
    }
    return { valid: true, message: '' };
};

/**
 * Validates post description
 * @param {string} description - Description to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export const validateDescription = (description) => {
    if (!description || description.trim().length === 0) {
        return { valid: false, message: 'Description is required' };
    }
    // Strip HTML tags for length validation
    const textContent = description.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 12) {
        return { valid: false, message: 'Description must be at least 12 characters' };
    }
    return { valid: true, message: '' };
};

