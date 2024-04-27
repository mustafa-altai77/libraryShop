const express = require("express");
const { Book, validateCreateBook, validateUpdateeBook } = require("../models/Book")
const asyncHandler = require("express-async-handler");
const { Author } = require("../models/Author");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();


/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
router.get("/", asyncHandler(async (req, res) => {
    const books = await Book.find();
    res.status(200).json(books);
}));
/**
 * @desc Get specific book by id
 * @route /api/books/:id
 * @method GET
 * @access public
 */

router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "book not found" })
    }
}));
/**
 * @desc Create new book
 * @route /api/books
 * @method POST
 * @access private (only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const book = new Book(
        {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
        });
    const result = await book.save();
    res.status(201).json(result);
}));

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const { error } = validateUpdateeBook(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const updateBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
        }
    },
        { new: true })
    if (updateBook) {
        res.status(200).json({ message: "book has been updated", result: updateBook });
    }
    else {
        res.status(404).json({ message: "book not found" });
    }

}));
/**
 * @desc Delete a book
 * @route /api/books/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {

    const book = await Book.findById(req.params.id)
    if (book) {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "book has been deleted" });
    }
    else {
        res.status(404).json({ message: "book not found" });
    }

}));

module.exports = router;