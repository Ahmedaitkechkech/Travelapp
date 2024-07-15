const express = require("express");
const router = express.Router();
const responsablecontoller = require("../controllers/responablesControllers");
const { responsableMiddleware } = require("../middlewares/adminMiddleware");


//get view login
router.get("/responsable", responsablecontoller.login_responsable)
//check base donner and get use login
router.post("/responsable", responsablecontoller.responsable_login)
//logout responsable
router.get("/logout-responsable", responsablecontoller.responsable_logout)

// get_Hotels
router.get("/Hotels", responsablecontoller.responsable_get_Hotels);
// get_AddHotel
router.get("/add-Hotel", responsablecontoller.responsable_get_AddHotel);
// Add_Hotel
router.post("/add-Hotel", responsablecontoller.responsable_AddHotel);
// edit_hotelbyid
router.get("/edit-Hotel/:id", responsablecontoller.responsable_editHotell_id);
// edit_hotel
router.put("/edit-Hotel/:id", responsablecontoller.responsable_editHotel);
// delete_hotelbyid
router.delete("/edit-Hotel/:id", responsablecontoller.responsable_deleteHotel);
module.exports = router;

