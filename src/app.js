const express = require("express");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const connectDB = require("../config/db"); 
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require('dotenv').config();
require('../utils/auth');

// Express app
const app = express();
app.use(express.json())
// Connect to DB
connectDB();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// Session configuration with connect-mongo
app.use(
    session({
        secret: "keyboard cat", // Replace with your own secret key
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: process.env.MONGODB_URI, // Use MongoDB URI from .env file
        }),
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days in milliseconds
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Specify the views directory
app.set("views", path.join(__dirname, "../views"));

// Register view engine
app.set("view engine", "ejs");

// Routes
app.get('/',(req,res)=>{
    res.redirect('/home')
})
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/responsable"));
app.use("/", require("./routes/client"));



// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
