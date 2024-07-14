const express = require("express");
const router = express.Router();
const responsablecontoller = require("../controllers/responablesControllers");
const { responsableMiddleware } = require("../middlewares/adminMiddleware");

router.get("/", responsablecontoller.get_card)
//get view login
router.get("/responsable", responsablecontoller.login_responsable)
//check base donner and get use login
router.post("/responsable", responsablecontoller.responsable_login)









//logout responsable
router.get("/logout-responsable", responsablecontoller.responsable_logout)





module.exports = router;

