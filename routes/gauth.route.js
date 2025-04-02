const express = require('express')
const passport = require('passport')
require('dotenv').config()

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect : '/login'}),
    (req, res) => {
        
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email }, // Payload
            process.env.JWT_SECRET, 
            { expiresIn: '48h' } 
        );

      
        res.json({
            message: 'Login successful',
            token,
            user: req.user,
        });
    }
)

module.exports = router