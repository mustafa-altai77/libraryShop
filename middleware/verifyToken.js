const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token === undefined) {
        return res.status(401).json({ message: "token not provided" })
    }
    const removeBearer = token.replace(/Bearer /g, "");

    if (removeBearer) {
        try {
            //to open payload
            const decoded = jwt.verify(removeBearer, process.env.JWT_SECRET_KEK);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ messsage: "invalide token" });
        }
    } else {
        res.status(401).json({ messsage: "no token provided" });
    }
}
// verify token & Authorize the user
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403)  //forbiden
                .json({ message: "You are not allowed" });
        }
    });
}
// verify token & Admin 

function verifyTokenAndAdmin(req, res, next) {

    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403)  //forbiden
                .json({ message: "You are not allowed, only admin allowed" });
        }
    });
}

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin };