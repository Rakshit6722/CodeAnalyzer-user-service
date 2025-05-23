const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User.model.js')
require('dotenv').config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                let user = await User.findOne({googleId: profile.id})

                if(!user){
                    user = new User({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        provider: 'google'
                    })

                    await user.save()
                }

                done(null, user)
            }catch(err){
                done(err, null)
            }
        }
    )
)

passport.serializeUser((user,done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id)
        done(null, user)
    }catch(err){
        done(err, null)
    }
})