const express = require('express')
const cors = require('cors')
const { connect } = require('mongoose')
require('dotenv').config()
const upload = require('express-fileupload')
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')


const app = express();
app.use(cookieParser());

// Request size limits
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// CORS configuration - environment-dependent
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({ 
    credentials: true, 
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(upload());
// Static uploads removed - using Cloudinary for file storage
// app.use('/uploads', express.static(__dirname + '/uploads'))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)

// Environment variable validation
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
}

connect(process.env.MONGO_URI).then(app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`))
).catch(error => { console.log(error) })


