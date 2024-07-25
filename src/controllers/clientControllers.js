const ClientSchema = require("../models/ClientSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretClient = process.env.jwtSecretClient;
const ClientReview = require('../models/clientReviewSchema');

const Signup_Client = async (req, res) => {
    try {
        res.render("client/Signup", {
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
};

const Signup = async (req, res) => {
    try {
        const { email,username, password, Confirm_Password } = req.body;
        console.log(req.body);

        if (password !== Confirm_Password) {
            req.flash("error", "Passwords do not match");
            return res.redirect('/signup'); 
        }
        const client = new ClientSchema({
            email,
            username,
            password
        });
        await client.save();
        req.flash("success", "You are now registered and can log in");
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}
// login page
const login = async (req, res) => {
    try {
        res.render("client/login", {
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
};
const login_client = async (req, res) => {
    try {
        const { email, password } = req.body;
        let errorType = '';
        let client=null;

        if (!email || !password) {
            errorType = "missingCredentials";
        } else {
             client = await ClientSchema.findOne({ email });
          
            if (!client) {
                errorType = "emailNotFound";
            } else if (password.length < 5) {
                errorType = "passwordTooShort";
            } else {
                const isPasswordValid = await bcrypt.compare(password, client.password);
                if (!isPasswordValid) {
                    errorType = "invalidLogin";
                }
            }
        }

        switch (errorType) {
            case "missingCredentials":
                return res.status(401).json({ error: "Username and password are required." });
            case "emailNotFound":
                return res.status(401).json({ error: "Email invalid." });
            case "passwordTooShort":
                return res.status(401).json({ error: "Password must be longer than 5 characters." });
            case "invalidLogin":
                return res.status(401).json({ error: "Password is incorrect." });
            default:
                const clientToken = jwt.sign({ clientId: client._id }, jwtSecretClient);
                req.session.username = client.username;
             
                res.cookie("clientToken", clientToken, { httpOnly: true });
                 res.status(200).redirect('/get-allReview');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred." });
    }
};


//  form to add a new review
const getAddReview = async  (req, res) => {

        const username = req.session.username;
        
       

        const reviews = await ClientReview.find({ username });
    res.render('client/add-review', { title: 'Add Review',
        reviews
     });
};

//  POST request to add a new review
const postAddReview = async (req, res) => {
   
        const { username,reviewText, rating } = req.body;
    
        
    
        try {
            const newReview = new ClientReview({
                username, 
                reviewText,
                rating,
               
            });
            await newReview.save();
            res.redirect('/get-allReview'); 
        } catch (err) {
            console.error(err);
            res.render('error', { message: 'Error adding review' });
        }
    };
    


//   delete a review
const deleteReview = async (req, res) => {
  
    try {
        await ClientReview.findByIdAndDelete(req.params.id);
        res.redirect('/get-allReview'); 
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error deleting review' });
    }
};

module.exports = {
    Signup_Client,
    Signup,
    login_client,
    login,
    getAddReview,
    postAddReview,
    deleteReview,
}