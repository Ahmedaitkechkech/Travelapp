// Require packages
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectMongo = require('connect-mongo');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');

// Require your custom modules
const connectDB = require('../config/db');
require('./routes/main');

// Create an Express application
const app = express();

// Middleware setup
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(methodOverride('_method'));

// Configure session middleware with connect-mongo
const MongoStore = connectMongo(session);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: process.env.MONGODB_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Flash messages middleware
app.use(flash());

// Connect to MongoDB
connectDB();

// Define routes and other configurations here

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
