const express = require("express");
const router = express.Router();
const clientControlers = require('../controllers/clientControlers');



/*app.get("/login",(req,res) => {
    try {
        res.render("client/login", {
            title: "clinet",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
})
app.get("/register",(req,res) => {
    try {
        res.render("client/Signup", {
            title: "clinet",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
})
app.get("/reviewClient",(req,res) => {
    try {
        res.render("client/review", {
            title: "clinet",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
})*/














// GET request for adding a review (display form)
router.get('/add-review', clientControlers.getAddReview);

// POST request to add a review
router.post('/add-review', clientControlers.postAddReview);

// DELETE request to delete a review
router.delete('/edite-review/:id', clientControlers.deleteReview);


module.exports = router;
