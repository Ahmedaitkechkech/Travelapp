const { storage } = require("../../utils/cloudinary");
const responablesControllers = require("../controllers/responablesControllers");
const multer = require("multer");


const express = require("express");
const router = express.Router();
const responsablecontoller = require("../controllers/responablesControllers");

const { responsableMiddleware } = require("../middlewares/adminMiddleware");

router.get("/", responsablecontoller.get_card)

//get view login
router.get("/responsable", responsablecontoller.login_responsable)


//check base donner and get use login
router.post("/responsable", responsablecontoller.responsable_login)


//getdashboardresponsable
router.get("/dashboard-Responsable", responsablecontoller.get_dashboard_responsable)


/* Get list of flight */
router.get("/flights", responsablecontoller.responsable_flight);

//responsable_get_Addflight
router.get("/add-flight", responsablecontoller.responsable_get_Addflight)

//responsable_Addflight
router.post("/add-flight", responsablecontoller.responsable_Add_flight)


/* Responsable edit flight */
router.get("/edit-flight/:id",  responsablecontoller.responsable_edit_flight_id);

/* Responsable edit flight */
router.put("/edit-flight/:id",  responsablecontoller.admin_edit_responsable);

/* Responsable delete flight */
router.delete("/edit-flight/:id",  responsablecontoller.responsable_delete_flight);










// Configure multer
const upload = multer({ storage: storage });




//get all ticket_flight
router.get("/tickets-flights", responsablecontoller.ticket_flight)

//add ticket_flight
router.get("/tickets", responsablecontoller.get_addTicket)

// POST route to create a new ticket flight
router.post("/tickets", upload.single("photo"), responablesControllers.createTicketFlight);

/* Responsable edit Ticket_flight get view */
router.get("/edit-Ticket_flight/:id",  responsablecontoller.responsable_edit_ticket_flight_id );

/* Responsable edit tecket-flight */
router.put("/edit-Ticket_flight/:id",  responsablecontoller.editTicketFlight);

/* Responsable delete tecket-flight */
router.delete("/edit-Ticket_flight/:id",  responsablecontoller.responsable_delete_Ticket_flight);



//logout responsable
router.get("/logout-responsable", responsablecontoller.responsable_logout)



module.exports = router;

