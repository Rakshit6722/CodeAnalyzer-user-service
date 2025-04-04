const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const ApiError = require('../utils/ApiError.js');

dotenv.config();


exports.userRegisterService = async (userData) => {
    try {
        const { firstname, lastname, email, password, phone, role } = userData;


        if (!firstname || !lastname || !email || !password || !phone) {
            throw new ApiError(400, 'All fields are required');
        }


        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            throw new ApiError(400, existingUser.email === email
                ? 'Email already exists'
                : 'Phone number already exists');
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role ?? 'user';

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            phone,
            provider: 'local',
            role: userRole
        });


        await newUser.save();

        return { message: 'User registered successfully' };
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};


exports.userLoginService = async (loginData) => {
    try {
        const { email, password } = loginData;


        if (!email || !password) {
            throw new ApiError(400, 'All fields are required');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { message: 'Login successful', token, user };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.editUserService = async (userId, updatedData) => {
    try {
        const { firstname, lastname, email, phone } = updatedData;


        if (!firstname || !lastname || !email || !phone) {
            throw new ApiError(400, 'All fields are required');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstname,
                lastname,
                email,
                phone
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new ApiError(404, 'User not found');
        }

        return { message: 'User updated successfully', user: updatedUser };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.getUserService = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return { message: 'User found successfully', user };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

exports.verifyTokenService = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            throw new ApiError(401, 'Invalid token');
        }

        return { message: "Valid token", user: decoded }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

