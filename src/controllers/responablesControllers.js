const Responsableshema = require("../models/responsableShema");
const HotelSchema = require("../models/HotelSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretraespo = process.env.jwtSecretraespo;



// login page
const login_responsable = async (req, res) => {
    try {
        res.render("Responsable/Login", {
            title: "Espace privé Reasponsable",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
};



// admin-login
const responsable_login = async (req, res) => {
    let responsable;
    try {
        const { username, password } = req.body;
        let errorType = "";

        if (!username || !password) {
            errorType = "missingCredentials";
        } else {
            responsable = await Responsableshema.findOne({ username });
            if (!responsable) {
                errorType = "invalidLogin";
            } else if (password.length < 5) {
                errorType = "passwordTooShort";
            } else {
                const ifPwdValid = await bcrypt.compare(password, responsable.password);
                if (!ifPwdValid) {
                    errorType = "invalidLogin";
                }
            }
        }

        switch (errorType) {
            case "missingCredentials":
                req.flash("error", "Username and password are required.");
                res.status(401).redirect("/responsable");
                break;
            case "passwordTooShort":
                req.flash("error", "Password must be at least 5 characters long.");
                res.status(401).redirect("/responsable");
                break;
            case "invalidLogin":
                req.flash("error", "Invalid username or password.");
                res.status(401).redirect("/responsable");
                break;
            default:
                const responsableToken = jwt.sign({ responsableId: responsable._id }, jwtSecretraespo);
                res.cookie("responsableToken", responsableToken, { httpOnly: true });
                res.status(200).send("responsable login in");
                break;
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/responsable");
    }
};


//logout responsable 

const responsable_logout = (req, res) => {
    res.clearCookie("responsableToken");
    res.redirect("/responsable");
};









/*-------------- Hotel Crud -----------*/
const responsable_get_AddHotel = async (req, res) => {
    try {
        res.render('Responsable/add-Hotel');
    } catch (error) {
        console.log(error);
    }
}

const responsable_AddHotel = async (req, res) => {
    try {
        const { Nom_Hotel, Adresse_Hotel, Username_Responsable, Description } = req.body;
        const Hotel = new HotelSchema({
            Nom_Hotel,
            Adresse_Hotel,
            Username_Responsable,
            Description
        });
        await Hotel.save();
        console.log("Hotel added");
       res.redirect('/Hotels');
    } catch (error) {
        console.log(error);
    }
}

const responsable_get_Hotels = async (req, res) => {
    try {
        const Hotels = await HotelSchema.find().sort({ createdAt: -1 });
        res.render('Responsable/Hotels', { Hotels });
    } catch (error) {
        console.log(error);
    }
}

const responsable_editHotel = async (req, res) => {
    try {
        const { Nom_Hotel, Adresse_Hotel, Username_Responsable, Description } = req.body;
        const HotelUpdate = {
            Nom_Hotel,
            Adresse_Hotel,
            Username_Responsable,
            Description
        };
        
        await HotelSchema.findByIdAndUpdate(req.params.id, HotelUpdate);
        
        console.log("Hotel updated");
         res.redirect('/Hotels');
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error occurred while updating the hotel");
    }
}

const responsable_editHotell_id = async (req, res) => {
    try {
        const HotelInfo = await HotelSchema.findOne({_id:req.params.id});
        res.render('Responsable/edit-Hotel', { HotelInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error occurred while finding the hotel");
    }
}

const responsable_deleteHotel = async (req, res) => {
    try {
        await HotelSchema.findByIdAndDelete(req.params.id);
        console.log("Hotel deleted");
        res.redirect("/Hotels");
    } catch (error) {
        console.log(error);
    }
}
/*-------------- Hotel Reservation  Crud -----------*/
const responsable_get_AddHotelReservation = async (req, res) => {
    try {
        res.render('Responsable/add-HotelReservation');
    } catch (error) {
        console.log(error);
    }
}

const responsable_AddHotelReservation =  async (req, res, next) => {
    try {
      // Upload photo to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Create ticket with Cloudinary URL
      const newTicket = new TicketFlight({
        name_compagnies: req.body.name_compagnies,
        photo: result.secure_url,
        prix: req.body.prix,
        lieu_depart: req.body.lieu_depart,
        lieu_arrivee: req.body.lieu_arrivee,
        heure_depart: req.body.heure_depart,
        heure_arrivee: req.body.heure_arrivee,
      });
  
      // Save ticket to database
      await newTicket.save();
  
      // Respond with success
      res.status(201).redirect("/tickets-flights")
    } catch (err) {
      console.error("Error creating ticket:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

module.exports = {
    login_responsable,
    responsable_login,
    responsable_logout,
    responsable_get_AddHotel,
    responsable_AddHotel,
    responsable_get_Hotels,
    responsable_editHotel,
    responsable_editHotell_id,
    responsable_deleteHotel,
/*** */
responsable_get_HotelReservation,
};