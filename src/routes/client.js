const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { ClientMiddleware } = require("../middlewares/clientMiddlewares");

/* Get Signup page */
router.get("/Signup",clientControllers.Signup_Client);
/* Check client */
router.post("/Signup",clientControllers.Signup);
/* Get login page */
router.get("/login",clientControllers.login);
/* Check client */
router.post("/login",clientControllers.login_client);


router.get("/get-allReview",ClientMiddleware,clientControllers.getAddReview);
router.post("/add-review",ClientMiddleware,clientControllers.postAddReview);
router.delete("/edite-review/:id",ClientMiddleware,clientControllers.deleteReview);
module.exports = router;