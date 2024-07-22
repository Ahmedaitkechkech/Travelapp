const { storage } = require("../../utils/cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const responsablecontoller = require("../controllers/responablesControllers");
const { responsableMiddleware } = require("../middlewares/responsableMiddleware");
const { upload } = require("../../utils/cloudinary");



router.get("/", responsablecontoller.get_card)

//get view login
router.get("/responsable", responsablecontoller.login_responsable)


//check base donner and get use login
router.post("/responsable", responsablecontoller.responsable_login)


//getdashboardresponsable
router.get("/dashboard-Responsable",responsableMiddleware, responsablecontoller.get_dashboard_responsable)


/* Get list of flight */
router.get("/flights",responsableMiddleware, responsablecontoller.responsable_flight);

//responsable_get_Addflight
router.get("/add-flight", responsableMiddleware, responsablecontoller.responsable_get_Addflight)

//responsable_Addflight
router.post("/add-flight", responsableMiddleware, responsablecontoller.responsable_Add_flight)


/* Responsable edit flight */
router.get("/edit-flight/:id", responsableMiddleware,  responsablecontoller.responsable_edit_flight_id);

/* Responsable edit flight */
router.put("/edit-flight/:id", responsableMiddleware,  responsablecontoller.admin_edit_responsable);

/* Responsable delete flight */
router.delete("/edit-flight/:id", responsableMiddleware,  responsablecontoller.responsable_delete_flight);


//get all ticket_flight
router.get("/tickets-flights", responsableMiddleware, responsablecontoller.ticket_flight)

//add ticket_flight
router.get("/tickets", responsableMiddleware, responsablecontoller.get_addTicket)

// POST route to create a new ticket flight
router.post("/tickets", responsableMiddleware, upload.single("photo"),responsablecontoller.createTicketFlight);

/* Responsable edit Ticket_flight get view */
router.get("/edit-Ticket_flight/:id", responsableMiddleware,  upload.single('photo'),  responsablecontoller.responsable_edit_ticket_flight_id );

/* Responsable edit tecket-flight */
router.put("/edit-Ticket_flight/:id", responsableMiddleware, upload.single('photo'),  responsablecontoller.editTicketFlight);

/* Responsable delete tecket-flight */
router.delete("/edit-Ticket_flight/:id", responsableMiddleware,  responsablecontoller.responsable_delete_Ticket_flight);

//get view add car
router.get("/add-car", responsableMiddleware, responsablecontoller.responsable_get_add_car)
//store  bcar in base de donee
router.post("/add-car",responsableMiddleware,upload.single('photo'), responsablecontoller.responsable_add_car)
//get all cars
router.get("/cardcar",responsableMiddleware, responsablecontoller.responsable_get_cars)
//get view edit chaque car by id
router.get("/edite-car/:id", responsableMiddleware,  responsablecontoller.responsable_edit_car_id);

//  edit chaque car by id
router.put("/edite-car/:id", responsableMiddleware, upload.single('photo'),  responsablecontoller.responsable_edit_car);

//  delete  car 
router.delete("/edite-car/:id", responsableMiddleware,  responsablecontoller.responsable_delete_car);


//test crad cae













//logout responsable
router.get("/logout-responsable", responsablecontoller.responsable_logout)

// get_Hotels
router.get("/Hotels", responsablecontoller.responsable_get_Hotels);
// get_AddHotel
router.get("/add-Hotel", responsablecontoller.responsable_get_AddHotel);
// Add_Hotel
router.post("/add-Hotel",upload.single('photo'), responsablecontoller.responsable_AddHotel);
// edit_hotelbyid
router.get("/edit-Hotel/:id", responsablecontoller.responsable_editHotell_id);
// edit_hotel
router.put("/edit-Hotel/:id",upload.single('photo'), responsablecontoller.responsable_editHotel);
// delete_hotelbyid
router.delete("/edit-Hotel/:id", responsablecontoller.responsable_deleteHotel);
/*----------- Hotel Reservation---------*/

// Hotel reservations routes
router.get("/HotelReservation", responsablecontoller.responsable_List_HotelReservation);
router.get("/add-HotelReservation", responsablecontoller.responsable_get_AddHotelReservation);
router.post("/add-HotelReservation", responsablecontoller.responsable_AddHotelReservation);
router.get("/edit-HotelReservation/:id", responsablecontoller.responsable_edit_HotelReservation_id);
router.put("/edit-HotelReservation/:id", responsablecontoller.responsable_edit_HotelReservation);
router.delete("/edit-HotelReservation/:id", responsablecontoller.responsable_delete_HotelReservation);

module.exports = router;

