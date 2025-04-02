const express = require('express')
const { registerUser, loginUser, getUser, editUser } = require('../controller/user.controller')
const { auth } = require('../middlewear/auth.middlewear')
const router = express.Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/getUser', auth, getUser)
router.put('/editUser', auth, editUser)


module.exports = router
