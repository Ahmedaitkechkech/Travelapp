const jwt = require("jsonwebtoken");
const jwtSecretraespo = process.env.jwtSecretraespo;
require("dotenv").config();

const responsableMiddleware = (req, res, next) => {
    // Check if responsableToken is present in cookies
    const responsableToken = req.cookies.responsableToken;
    if (!responsableToken) {
        req.flash("error", "Please log in first to access the dashboard.");
        return res.redirect("/responsable");
    }

    try {
        const decoded = jwt.verify(responsableToken, jwtSecretraespo);
        req.responsableToken = decoded.responsableId;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        req.flash("error", "Session expired, please log in again.");
        return res.redirect("/responsable");
    }
};

module.exports = { responsableMiddleware };
