const express = require("express");
const router = express.Router();
const { User, validateUpdaterUser } = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("../middleware/verifyToken");
/**
 * @desc Update a user
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
router.put("/:id", verifyTokenAndAuthorization ,asyncHandler(async (req, res) => {
    const { error } = validateUpdaterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        },
    }, { new: true }).select("-password");
    res.status(200).json(updateUser);
}));

/**
 * @desc Get all users
 * @route /api/users
 * @method GET
 * @access private (only Admin)
 */
router.get("/", verifyTokenAndAdmin ,asyncHandler(async (req, res) => {
    const usersList= await User.find().select("-password");
    res.status(200).json(usersList);
}));
/**
 * @desc Get user BY ID
 * @route /api/users/:ID
 * @method GET
 * @access private (only Admin & user him self)
 */
router.get("/:id", verifyTokenAndAuthorization ,asyncHandler(async (req, res) => {
    const user= await User.findById(req.params.id).select("-password");

    if(user)
    {
        res.status(200).json(user);
    }
    else{
        res.status(404).json({message:"user not found !"});
    }
    
}));
/**
 * @desc Delete user bY ID
 * @route /api/users/:ID
 * @method DELETE
 * @access private (only Admin & user him self)
 */
router.delete("/:id", verifyTokenAndAuthorization ,asyncHandler(async (req, res) => {
    const user= await User.findById(req.params.id);

    if(user)
    {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"User has been deleted successfully"});
    }
    else{
        res.status(404).json({message:"user not found !"});
    }
    
}));
module.exports = router;