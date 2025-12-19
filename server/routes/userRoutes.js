{/* Backend user routes */}

const { Router } = require('express')
const router = Router()

const { registerUser, verifyOTP, resendOTP, loginUser, logoutUser, getUser, getCurrent, changeAvatar, editUser, getAuthors, } = require('../controllers/userControllers')

const authMiddleware = require('../middleware/authMiddleware')
const { authLimiter } = require('../middleware/rateLimiter')

router.post('/register', authLimiter, registerUser)
router.post('/verifyOTP', authLimiter, verifyOTP)
router.post('/resendOTP', authLimiter, resendOTP)
router.post('/login', authLimiter, loginUser)
router.post('/logout', authMiddleware, logoutUser)
router.get('/current', authMiddleware, getCurrent)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)


module.exports = router 