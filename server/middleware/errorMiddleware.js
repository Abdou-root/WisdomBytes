{/* Error handling middleware */}

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404);
    next(error);
}

// Handle errors middleware
const errorHandler = (error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const statusCode = error.status || error.code || 500;

    // Log error details server-side
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        statusCode: statusCode
    });

    // Return user-friendly messages
    let message;
    if (statusCode === 404) {
        message = 'Resource not found';
    } else if (statusCode === 403) {
        message = 'Access forbidden';
    } else if (statusCode === 401 || statusCode === 402) {
        message = 'Authentication required';
    } else if (statusCode === 422) {
        // Validation errors - show the message as it's user-friendly
        message = error.message || 'Validation error';
    } else if (statusCode >= 500) {
        // Server errors - generic message in production
        message = isProduction 
            ? 'An internal server error occurred. Please try again later.' 
            : error.message || 'An unknown error occurred';
    } else {
        message = error.message || 'An error occurred';
    }

    res.status(statusCode).json({ message });
}


module.exports = { notFound, errorHandler } 