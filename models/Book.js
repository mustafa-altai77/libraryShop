const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Author"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    cover:{
        type: String,
        required: true,
        enum:["soft cover","hard cover"]
    }
}, {
    timestamps: true,
});

const Book = mongoose.model("Books", bookSchema);
//validate create book
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200).required(),
        author:Joi.string().required(),
        description:Joi.string().trim().min(5).required(),
        price: Joi.number().min(0).required(),
        cover:Joi.string().valid("soft cover","hard cover").required(),
    });
    return schema.validate(obj);

}
//validate update book
function validateUpdateeBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(200),
        author:Joi.string(),
        description:Joi.string().trim().min(35),
        price: Joi.number().min(0),
        cover:Joi.string().valid("soft cover","hard cover")
    });
    return schema.validate(obj);

}
module.exports = {
    Book,
    validateCreateBook,
    validateUpdateeBook
};