const jwt = require("jsonwebtoken");
const jwtSecretraespo = process.env.jwtSecretraespo;
const Responsableshema = require('../models/responsableShema'); // Adjust path as needed
require("dotenv").config();

const responsableMiddleware = async (req, res, next) => {
    // Check if responsableToken is present in cookies
    const responsableToken = req.cookies.responsableToken;
    if (!responsableToken) {
        req.flash("error", "Please log in first to access the dashboard.");
        return res.redirect("/responsable");
    }

    try {
        const decoded = jwt.verify(responsableToken, jwtSecretraespo);
        const responsable = await Responsableshema.findById(decoded.responsableId);
       /* tcheck session responsaple*/  
        if (!responsable) {
            req.flash("error", "Invalid session.");
            return res.redirect("/responsable");
        }

        req.user = responsable; // Set req.user to the authenticated responsable
        next();
         /**************/ 
    } catch (error) {
        console.error("JWT Verification Error:", error);
        req.flash("error", "Session expired, please log in again.");
        return res.redirect("/responsable");
    }
};

module.exports = { responsableMiddleware };
