{/* Error handling middleware */}


// not found (404)

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
    res.status(error.status || 500).json({ message: error.message || "An unknown error occured" })

}


module.exports = { notFound, errorHandler } 