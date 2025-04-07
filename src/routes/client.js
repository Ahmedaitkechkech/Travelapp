const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { ClientMiddleware} = require("../middlewares/clientMiddlewares");
const multer = require("multer");
const passport = require("passport");
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
/*google OAuth*/
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),clientControllers.login_OAuth);

router.get("/get-allReview",ClientMiddleware,clientControllers.getAddReview);
router.post("/add-review",ClientMiddleware,clientControllers.postAddReview);
router.delete("/edite-review/:id",ClientMiddleware,clientControllers.deleteReview);

router.get("/Home",ClientMiddleware,clientControllers.findTicket);
router.post("/flight-list",ClientMiddleware, upload.array(),clientControllers.getTicketList);
router.get("/flight-detail/:id",clientControllers.getFlight_detail);
router.post("/flight-detail",clientControllers.client_AddflightReservation);
router.get("/edit-flight-detail/:id",clientControllers.client_EditflightReservation);
router.put("/edit-flight-detail/:id",clientControllers.client_EditflightReservation_byid);
router.delete("/delete-flight-detail/:id",clientControllers.client_delete_flightReservation);
router.get("/flight-booking",ClientMiddleware,clientControllers.client_getAll_CardReservationFlight);
router.post("/flight-booking/:id",ClientMiddleware,clientControllers.client_getbyId_CardReservationFlight);
//About Page  and contact and team
router.get("/Contact",ClientMiddleware,clientControllers.Contact);
//post contact 
router.post("/add_contact",ClientMiddleware,clientControllers.client_add_contact);
router.get("/About",ClientMiddleware,clientControllers.About);
//router.get("/Team",ClientMiddleware,clientControllers.Teamworeked);

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

//strip checkout car post 
router.post("/checkoutCar", ClientMiddleware,clientControllers.checkoutCar);
router.get("/completeCar", clientControllers.completeCar)
router.get("/cancelCar", clientControllers.cancelCar)
//strip checkout Hotel  
router.post("/checkoutHotel", ClientMiddleware,clientControllers.checkoutHotel);
router.get("/completeHotel", clientControllers.completeHotel)
router.get("/cancelHotel", clientControllers.cancelHotel)


//strip checkout Hotel  
router.post("/checkoutFlight", ClientMiddleware,clientControllers.checkoutFlight);
router.get("/completeFlight", clientControllers.completeFlight);
router.get("/cancelFlight", clientControllers.cancelFlight);
//settings client
router.get("/client_settings",ClientMiddleware, clientControllers.client_settings)
router.get("/myBooking",ClientMiddleware, clientControllers.clinet_myBooking)
router.get("/delete",ClientMiddleware, clientControllers.popaup_delete)
router.get("/deleteProfile",ClientMiddleware, clientControllers.deleteProfile)

//get all Hoteles and car to client and details
router.get("/Listing_Hoteles",ClientMiddleware, clientControllers.client_getAll_Hoteles)
router.get("/Listing_cars",ClientMiddleware, clientControllers.client_getAll_cars)
router.get("/Hotel_detail/:id",ClientMiddleware, clientControllers.client_getAll_Hoteles_id)
router.get("/Car_detail/:id",ClientMiddleware, clientControllers.client_getAll_car_id)

//client logout 
router.get("/logout-client", clientControllers.client_logout)



//404
router.use('*', clientControllers.error404); 


module.exports = router;