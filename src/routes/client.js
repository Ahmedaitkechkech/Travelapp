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
//get view Recherche
router.get("/client-Hotel",ClientMiddleware,clientControllers.getIndexHotel);
//get data a partir db
router.post("/client-Hotel",ClientMiddleware,clientControllers.client_addhotelFind);
//get view client reserver Hotel
router.get("/reserver-Hotel",ClientMiddleware,clientControllers.client_get_AddHotelReservation);
//store data reservation in db
router.post("/add-ReservationClient",ClientMiddleware,clientControllers.client_AddHotelReservation);
//get all card reservation
router.get("/Cards-reservation",ClientMiddleware,clientControllers.client_getAll_CardReservation);
//get view edite reservation Hotel
router.get("/edit-HotelReservation-cleint/:id",ClientMiddleware,clientControllers.client_edit_HotelReservation_id);
//put reservation Hotel
router.put("/edit-HotelReservation-cleint/:id",ClientMiddleware,clientControllers.client_edit_HotelReservation);
//delet hotel reserver
router.delete("/edit-HotelReservation-cleint/:id",ClientMiddleware,clientControllers.client_delete_HotelReservation);











module.exports = router;