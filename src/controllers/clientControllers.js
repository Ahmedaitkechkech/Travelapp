const ClientSchema = require("../models/ClientSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretClient = process.env.jwtSecretClient;


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
            console.log(client);
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
                res.cookie("clientToken", clientToken, { httpOnly: true });
                return res.status(200).json({ message: "Login successful." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred." });
    }
};


module.exports = {
    Signup_Client,
    Signup,
    login_client,
    login
}