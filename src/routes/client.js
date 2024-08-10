const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { ClientMiddleware } = require("../middlewares/clientMiddlewares");
const multer = require("multer");
// Configure Multer for parsing multipart/form-data
const upload = multer();
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

router.get("/Home",clientControllers.findTicket);
router.post("/flight-list", upload.array(),clientControllers.getTicketList);
router.get("/flight-detail/:id",clientControllers.getFlight_detail);
router.post("/flight-detail",clientControllers.client_AddflightReservation);
//About Page 
router.get("/About",clientControllers.About);
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

//get view index car
router.get("/index-car",ClientMiddleware,clientControllers.client_getIndex_car);
//finf car in db
router.post("/client-cars",ClientMiddleware,clientControllers.client_add_Find_car);

//Crud CAR RESERVATION
router.get("/add-carReservation",ClientMiddleware,clientControllers.client_get_AddCarReservation);
//stire car Reservation
router.post("/add-ReservationCar",ClientMiddleware,clientControllers.client_AddCarReservation);
//get all reservation car
router.get("/Cards-reservationCar",ClientMiddleware,clientControllers.client_getAll_CardReservationCar);
//get view edit car reservation 
router.get("/edite_Reservation_car/:id",ClientMiddleware,clientControllers.client_edit_carReservation_id);

//put   car reservation 
router.put("/edite_Reservation_car/:id",ClientMiddleware,clientControllers.client_edit_CarReservation);
//delete   car reservation 
router.delete("/edite_Reservation_car/:id",ClientMiddleware,clientControllers.client_delete_CarReservation);


//client logout 
router.get("/logout-client", clientControllers.client_logout)






module.exports = router;