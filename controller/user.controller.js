const { userRegisterService, editUserService, getUserService, userLoginService } = require("../services/user.service");
const ApiError = require('../utils/ApiError.js');

exports.registerUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            phone,
            role
        } = req.body;

        const response = await userRegisterService({
            firstname,
            lastname,
            email,
            password,
            phone,
            role
        })

        res.status(201).json(response);

    } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ error: err.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await userLoginService({
            email,
            password
        })

        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ error: err.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.editUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            phone,
            _id
        } = req.body;

        const response = await editUserService(_id, {
            firstname,
            lastname,
            email,
            phone
        })

        res.status(200).json(response);

    } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ error: err.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getUser = async (req, res) => {
    try {
        const id = req.user.userId
        const response = await getUserService(id)
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ error: err.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
}