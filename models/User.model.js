const mongoose = require('mongoose');

const userModelSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        trim: true
    },
    lastname:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        select: false
    },
    phone:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    googleId:{
        type: String,
        required: false
    },
    provider:{
        type: String,
        default: 'local'
    },
    role:{
        type:String,
        enum:['admin', 'user'],
    }
},
{
    timestamps: true
}
)


module.exports = mongoose.model('User', userModelSchema)