const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { adminMiddleware } = require("../middlewares/adminMiddleware");

/* Get Signup page */
router.get("/Signup",clientControllers.Signup_Client);
/* Check client */
router.post("/Signup",clientControllers.Signup);
/* Get login page */
router.get("/login",clientControllers.login);
/* Check client */
router.post("/login",clientControllers.login_client);
module.exports = router;