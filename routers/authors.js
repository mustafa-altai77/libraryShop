const express = require("express");
const { Author, validateCreateAuthors, validateUpdateAuthor } = require("../models/Author");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
router.get("/", asyncHandler(
    async (req, res) => {
        const authorList = await Author.find();
        res.status(200).json(authorList);

    }
));
/**
 * @desc Get spacific author by id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
router.get("/:id", asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);

        if (author) {
            res.status(200).json(author);
        }
        else {
            res.status(404).json({ message: "author not found" });
        }

    }
));
/**
 * @desc create an author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
        const { error } = validateCreateAuthors(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image,
        });
        const result = await author.save();
        res.status(201).json(result);
    }
));
/**
 * @desc update an author
 * @route /api/authors/:id
 * @method PUT
 * @access private (only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
        const { error } = validateUpdateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image: req.body.image,
            }
        }, {
            new: true,
        });
        if (author) {
            res.status(200).json({ message: "author has been updated", author });
        }
        else {
            res.status(404).json({ message: "author not found" });
        }
    }
));
/**
 * @desc Delete an author
 * @route /api/authors/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin,asyncHandler(
    async (req, res) => {
        const author = Author.findByIdAndDelete(req.params.id)
        if (author) {
            res.status(200).json({ message: "author has been deleted" });
        }
        else {
            res.status(404).json({ message: "author not found" });
        }


    }
));


module.exports = router;