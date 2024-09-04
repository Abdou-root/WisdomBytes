{/* Backend user routes */}

const { Router } = require('express')
const router = Router()

const { registerUser, verifyOTP, resendOTP, loginUser, logoutUser, getUser, getCurrent, changeAvatar, editUser, getAuthors, } = require('../controllers/userControllers')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/login', loginUser)
router.post('/logout', authMiddleware, logoutUser)
router.get('/current', authMiddleware, getCurrent)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)


module.exports = router 