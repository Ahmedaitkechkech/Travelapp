const express = require("express");
const router = express.Router();
const adminTravel = require("../controllers/adminController");
const {adminMiddleware} = require("../middlewares/adminMiddleware");


/******************Admin************************/

/*get login page*/

router.get("/admin", adminTravel.loginAuth);
/*check admin*/
router.post("/admin", adminTravel.admin_login);

/*Dashboard admin*/
router.get("/dashborad", adminMiddleware, adminTravel.get_dashboard_admin);

/*logout admin*/
router.get("/logout", adminMiddleware, adminTravel.admin_logout);

/* -----------------------routers CRUD Adlin to responssable---------------------- */

/*get list responsables*/
router.get("/responsables",adminMiddleware, adminTravel.admin_responsables);

/*get view addRrsponsable*/ 
router.get("/add-responsable",adminMiddleware, adminTravel.admin_get_AddResponssable);

/*Post  Rrsponsable db*/ 
router.post("/add-responsable", adminMiddleware, adminTravel.admin_Add_Responssable);

/* admin edit  Rrsponsable */ 
router.get("/edit-responsable/:id", adminMiddleware, adminTravel.admin_edit_responsable_id );

/*  admin  edit  Responsable */ 
router.put("/edit-responsable/:id", adminMiddleware,  adminTravel.admin_edit_responsable );

/*admin delete Rrsponsable */ 
router.delete("/edit-responsable/:id",adminMiddleware, adminTravel.admin_delete_responsable );









module.exports = router;
