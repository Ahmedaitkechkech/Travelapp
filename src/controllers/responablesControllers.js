const { cloudinary } = require("../../utils/cloudinary");

const Responsableshema = require("../models/responsableShema"); 
const flightshema = require("../models/flightsSchema"); 
const Ticket_flight = require("../models/Ticket_flight"); 
const carsShema = require("../models/carsShema"); 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretraespo = process.env.jwtSecretraespo;



//get card respinsable and client
const get_card = async (req, res) => {
    try {
        res.render("Responsable/index", {
            title: "Espace privé Reasponsable",
         
        });
    } catch (error) {
        console.log(error);
    }
};



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



// responsable-login
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
                req.session.username = responsable.username;
                res.status(200).redirect("/dashboard-Responsable");
                break;
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/responsable");
    }
};


// get dashboard
const get_dashboard_responsable = async (req, res) => {
    try {
        res.render("Responsable/dashboard-Responsable", {
            title: "Espace privé Reasponsable",
         
        });
    } catch (error) {
        console.log(error);
    }
};


// get view add flight
const responsable_get_Addflight = async (req, res) => {
    try {
        res.render("Responsable/add-flights", {
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
    }
};


// get all flight
const responsable_flight = async (req, res) => {
    try {
        const flightinfo = await flightshema.find({ username: req.session.username }).sort({ createdAt: -1 });
        res.render('Responsable/flights', {
            title: "Espace privé resmpnsable",
            flightinfo,
        });
    } catch (error) {
        console.log(error);
    }
}


// add flight to db
const responsable_Add_flight = async (req, res) => {
    try {
        const { username, name_companies, description } = req.body;

        // Validate required fields
        if (!username || !name_companies || !description) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        const newFlight = new flightshema({
            username: req.session.username,

             name_companies, description
        });

        await newFlight.save();
        req.flash("success", "Flight has been saved successfully!");

        res.status(201).redirect("/flights");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//responsable_edit_flight get view

const responsable_edit_flight_id = async (req, res) => {
    try {
        const flightinfo = await flightshema.findOne({ _id: req.params.id });
        res.render("Responsable/edite-flights", {
            flightinfo,
            title: "Espace privé resmpnsable",
        });
    } catch (error) {
        console.log(error);
    }
};


// responsable_edit_flight  by id
const admin_edit_responsable = async (req, res) => {
    try {
        const { username, name_companies, description } = req.body;

        const updateObject = {};
        if (username) updateObject.username = username;
        if (name_companies) updateObject.name_companies = name_companies;
        if (description) updateObject.description = description;
       
        

        await flightshema.findByIdAndUpdate(req.params.id, updateObject);

        res.redirect("/flights");
    } catch (error) {
        console.log(error);
    }
};

// delete flight
const responsable_delete_flight = async (req, res) => {
    try {
        await flightshema.deleteOne({ _id: req.params.id });
        res.redirect("/flights");
    } catch (error) {
        console.log(error);
    }
};


//get view add tecket 

const get_addTicket = async (req, res) => {
    try {
        res.render("Responsable/add-ticket-flight", {
            title: "Espace privé Reasponsable",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
};





// Handle ticket creation
const createTicketFlight = async (req, res, next) => {
  try {
    // Upload photo to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create ticket with Cloudinary URL
    const newTicket = new Ticket_flight({
        username: req.session.username,

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


//get all ticket to responsable
const ticket_flight = async (req, res) => {
    try {
        const flightinfoTecket = await Ticket_flight.find({ username: req.session.username }).sort({ createdAt: -1 });
        res.render('Responsable/ticket-flight.ejs', {
            title: "Espace privé resmpnsable",
            flightinfoTecket,
        });
    } catch (error) {
        console.log(error);
    }
}
//get view edit by chaque tecket-flight
const responsable_edit_ticket_flight_id = async (req, res) => {
    try {
        const flighTecketinfo = await Ticket_flight.findOne({ _id: req.params.id });
        res.render("Responsable/edit-ticket-flight", {
            flighTecketinfo,
            title: "Espace privé resmpnsable",
        });
    } catch (error) {
        console.log(error);
    }
};

//edit in base bd
const editTicketFlight = async (req, res) => {
    try {
        const { name_compagnies, prix, lieu_depart, lieu_arrivee, heure_depart, heure_arrivee } = req.body;
        
      
    
        const updateObject = {};
        if (name_compagnies) updateObject.name_compagnies = name_compagnies;
        if (prix) updateObject.prix = prix;
        if (lieu_depart) updateObject.lieu_depart = lieu_depart;
        if (lieu_arrivee) updateObject.lieu_arrivee = lieu_arrivee;
        if (heure_depart) updateObject.heure_depart = heure_depart;
        if (heure_arrivee) updateObject.heure_arrivee = heure_arrivee;
    
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          updateObject.photo = result.secure_url;
        }
    
         await Ticket_flight.findByIdAndUpdate(req.params.id, updateObject, { new: true });
    
      
        res.redirect("/tickets-flights");
      } catch (error) {
        console.error("Error editing ticket:", error);
        res.status(500).json({ error: "Server error" });
      }
    };
      
// delete Ticket-flight
const responsable_delete_Ticket_flight= async (req, res) => {
    try {
        await Ticket_flight.deleteOne({ _id: req.params.id });
        res.redirect("/tickets-flights");
    } catch (error) {
        console.log(error);
    }
};

//responsable get view add-car
const responsable_get_add_car = async (req, res) => {
    try {
        res.render("Responsable/add-car", {
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
    }
};

const responsable_add_car = async (req, res, next) => {
    try {
      // Upload photo to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Create ticket with Cloudinary URL
      const newCar = new carsShema({
          username: req.session.username,
  
          name_companies: req.body.name_companies,
        photo: result.secure_url,
        prix: req.body.prix,
        car_model:req.body.car_model,
        nombre_seats: req.body.nombre_seats,
        type: req.body.type,
        Lieu_de_ramassage: req.body.Lieu_de_ramassage,
        Date_de_ramassage: req.body.Date_de_ramassage,
        Temps: req.body.Temps,
        name_car: req.body.name_car,
        description: req.body.description,
      });
  
      // Save car to database
      await newCar.save();
  
      // Respond with success
      res.status(201).redirect("/cardcar")
    } catch (err) {
      console.error("Error creating car:", err);
      res.status(500).json({ error: "Server error" });
    }
  };


// get all cars
const responsable_get_cars = async (req, res) => {
    try {
        const cars = await carsShema.find({ username: req.session.username }).sort({ createdAt: -1 });
        res.render('Responsable/cars', {
            title: "Espace privé resmpnsable",
            cars,
        });
    } catch (error) {
        console.log(error);
    }
}
//responsable_edit_car_id get view add
const responsable_edit_car_id = async (req, res) => {
    try {
        const carinfo = await carsShema.findOne({ _id: req.params.id });
        res.render("Responsable/edite-car", {
            carinfo,
            title: "Espace privé resmpnsable",
        });
    } catch (error) {
        console.log(error);
    }
};


/****************************************************** */
// responsable_edit_car by id
const responsable_edit_car = async (req, res) => {
    try {
        const { name_companies, prix, Lieu_de_ramassage, Date_de_ramassage,car_model, name_car,type,description,nombre_seats,Temps } = req.body;
        
      
    
        const updateObject = {};
        if (name_companies) updateObject.name_companies = name_companies;
        if (prix) updateObject.prix = prix;
        if (Lieu_de_ramassage) updateObject.Lieu_de_ramassage = Lieu_de_ramassage;
        if (Date_de_ramassage) updateObject.Date_de_ramassage = Date_de_ramassage;
        if (name_car) updateObject.name_car = name_car;
        if (type) updateObject.type = type;
        if (description) updateObject.description = description;
        if (car_model) updateObject.car_model = car_model;
        if (nombre_seats) updateObject.nombre_seats = nombre_seats;
        if (Temps) updateObject.Temps = Temps;
    
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          updateObject.photo = result.secure_url;
        }
    
         await carsShema.findByIdAndUpdate(req.params.id, updateObject, { new: true });
    
      
        res.redirect("/cardcar");
      } catch (error) {
        console.error("Error editing  car:", error);
        res.status(500).json({ error: "Server error" });
      }
};




// delete car
const responsable_delete_car = async (req, res) => {
    try {
        await carsShema.deleteOne({ _id: req.params.id });
        res.redirect("/cardcar");
    } catch (error) {
        console.log(error);
    }
};






//logout responsable 

const responsable_logout = (req, res) => {
    res.clearCookie("responsableToken");
    res.redirect("/responsable");
};



//card car
const cardcar = async (req, res) => {
    const cars = await carsShema.find({ username: req.session.username }).sort({ createdAt: -1 });

    try {
        res.render("Responsable/cardcar", {
            title: "Espace privé Reasponsable",
            cars

           
        });
    } catch (error) {
        console.log(error);
    }
};





module.exports = {
    login_responsable,
    responsable_login,
    get_card,
    get_dashboard_responsable,

    //CRUD FLIGHTS
    responsable_flight,
    responsable_get_Addflight,
    responsable_Add_flight,
    responsable_edit_flight_id,
    admin_edit_responsable,
    responsable_delete_flight,

    //crud ticket flight
    get_addTicket,
    createTicketFlight,
    ticket_flight,
    responsable_edit_ticket_flight_id,
    editTicketFlight,
    responsable_delete_Ticket_flight,

    //CRUD cars
    responsable_get_add_car,
    responsable_add_car,
    responsable_get_cars,
    responsable_edit_car_id,
    responsable_edit_car,
    responsable_delete_car,

   //test card
   cardcar,
    

    responsable_logout,
};