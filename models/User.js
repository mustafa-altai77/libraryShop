const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        minlength: 5,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
        minlength: 2,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
//Gnerate Token
UserSchema.methods.generateToken=function()
{
   return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEK, { expiresIn: "1d" });
}

//User Model
const User = mongoose.model("Users", UserSchema);

//Validate Register User
function validateRegisterUser(obj)
{
    const schema=Joi.object({
        email:Joi.string().trim().min(5).max(100).required(),
        username:Joi.string().trim().min(2).max(200).required(),
        password:Joi.string().trim().min(6).required(),
       // isAdmin:Joi.bool(),
    });
    return schema.validate(obj);
}
//Validate Login User
function validateLoginUser(obj)
{
    const schema=Joi.object({
        email:Joi.string().trim().min(5).max(100).required(),    
        password:Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}
//Validate Update User
function validateUpdaterUser(obj)
{
    const schema=Joi.object({
        email:Joi.string().trim().min(5).max(100),
        username:Joi.string().trim().min(2).max(200),
        password:Joi.string().trim().min(6),
       // isAdmin:Joi.bool(),
    });
    return schema.validate(obj);
}

module.exports = {
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdaterUser
}