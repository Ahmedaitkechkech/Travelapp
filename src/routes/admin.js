const express = require("express");
const router = express.Router();
const adminTravel = require("../controllers/adminController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

/****************** Admin ************************/

/* Get login page */
router.get("/admin", adminTravel.loginAuth);
/* Check admin */
router.post("/admin", adminTravel.admin_login);

/* Dashboard admin */
router.get("/dashboard", adminMiddleware, adminTravel.get_dashboard_admin);

/*Settings admin*/
router.get("/Settings",adminMiddleware,adminTravel.admin_get_Settings);


/*logout admin*/
router.get("/logout", adminMiddleware, adminTravel.admin_logout);

/* ----------------------- Routes CRUD Admin to Responsable ---------------------- */

/* Get list of responsables */
router.get("/responsables", adminMiddleware, adminTravel.admin_responsables);

/* Get view to add Responsable */
router.get("/add-responsable", adminMiddleware, adminTravel.admin_get_AddResponsable);

/* Post Responsable to DB */
router.post("/add-responsable", adminMiddleware, adminTravel.admin_Add_Responsable);

/* Admin edit Responsable */
router.get("/edit-responsable/:id", adminMiddleware, adminTravel.admin_edit_responsable_id);

/* Admin edit Responsable */
router.put("/edit-responsable/:id", adminMiddleware, adminTravel.admin_edit_responsable);

/* Admin delete Responsable */
router.delete("/edit-responsable/:id", adminMiddleware, adminTravel.admin_delete_responsable);

/* Admin affiche les client */
router.get("/admin-clients", adminMiddleware, adminTravel.admin_clients);

/* Admin affiche les Hoteles */
router.get("/admin-Hoteles", adminMiddleware, adminTravel.admin_Hoteles);

/* Admin affiche les flights */
router.get("/admin_flights", adminMiddleware, adminTravel.admin_flights);

/* Admin affiche les cars */
router.get("/admin-cars", adminMiddleware, adminTravel.admin_cars);


router.get("/test", adminMiddleware, adminTravel.test);
module.exports = router;
