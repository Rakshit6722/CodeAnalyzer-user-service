const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()

    }catch(err){


        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        const role = req.user.role;

        if(role !== 'admin'){
            return res.status(403).json({ message: 'Access denied, admin only' });
        }

        next()
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}