const express = require('express')
const { dbConnect } = require('./config/database')
const cors = require('cors')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const GoogleAuth = require('./routes/gauth.route')
const UserRoute = require('./routes/user.route.js')
require('./config/gauthSetup')

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())  
app.use(passport.session())

app.use('/auth', GoogleAuth)
app.use('/user', UserRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

dbConnect()