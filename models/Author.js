const mongoose = require("mongoose");
const Joi = require("joi");

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    image: {
        type: String,
        default: "default-avatar.png",

    }


},
    {
        timestamps: true
    }
);
function validateCreateAuthors(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(2).max(100).required(),
      image: Joi.string(),
    });
    return schema.validate(obj);
}
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(200),
        nationality: Joi.string().trim().min(2).max(200),
        image: Joi.string().trim().min(3).max(100),
    });
    return schema.validate(obj);
}

const Author=mongoose.model("Authors",AuthorSchema);
module.exports={Author,validateCreateAuthors,validateUpdateAuthor};