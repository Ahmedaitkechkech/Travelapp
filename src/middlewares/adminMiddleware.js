const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
require("dotenv").config();

const adminMiddleware = (req, res, next) => {
    // Check if adminToken is present in cookies
    const adminToken = req.cookies.adminToken;
    if (!adminToken) {
        req.flash("error", "Please log in first to access the dashboard.");
        return res.redirect("/admin");
    }

    try {
        const decoded = jwt.verify(adminToken, jwtSecret);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        req.flash("error", "Session expired, please log in again.");
        return res.redirect("/admin");
    }
};

module.exports = { adminMiddleware };
