const jwt = require("jsonwebtoken");
const jwtSecretClient = process.env.jwtSecretClient;
require("dotenv").config();


const ClientMiddleware = (req, res, next) => {
    // Check if ClientToken is present in cookies
    const ClientToken = req.cookies.clientToken;
    if (!ClientToken) {
        req.flash("error", "Please log in first to access the dashboard.");
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(ClientToken, jwtSecretClient);

        req.ClientToken = decoded.ClientId;

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        req.flash("error", "Session expired, please log in again.");
        return res.redirect("/login");
    }
};

module.exports = { ClientMiddleware };





