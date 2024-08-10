const { cloudinary } = require("../../utils/cloudinary");
const Responsableshema = require("../models/responsableShema");
const HotelSchema = require("../models/HotelSchema");
const CarReservation = require("../models/Car_reservation");
const flightReservationshema = require("../models/flightsReservation"); 
const Ticket_flight = require("../models/Ticket_flight"); 
const carsShema = require("../models/carsShema"); 
const reviews = require("../models/clientReviewSchema"); 
const client = require("../models/ClientSchema"); 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HotelReservSchema = require("../models/Hotel_ReserSchema")
const jwtSecretraespo = process.env.jwtSecretraespo;
const mongoose = require('mongoose');


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
      Date_depart: req.body.Date_depart,
      Date_arrivee: req.body.Date_arrivee,
      Travel_Class: req.body.Travel_Class,

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
        const { name_compagnies, prix, lieu_depart, lieu_arrivee, heure_depart, heure_arrivee,Date_depart,Date_arrivee,Travel_Class} = req.body;
        
      
    
        const updateObject = {};
        if (name_compagnies) updateObject.name_compagnies = name_compagnies;
        if (prix) updateObject.prix = prix;
        if (lieu_depart) updateObject.lieu_depart = lieu_depart;
        if (lieu_arrivee) updateObject.lieu_arrivee = lieu_arrivee;
        if (heure_depart) updateObject.heure_depart = heure_depart;
        if (heure_arrivee) updateObject.heure_arrivee = heure_arrivee;
        if (Date_depart) updateObject.Date_depart = Date_depart;
        if (Date_arrivee) updateObject.Date_arrivee = Date_arrivee;
        if (Travel_Class) updateObject.Travel_Class = Travel_Class;
    
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
        res.render('Responsable/cardcar', {
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
        const { name_companies, prix, Lieu_de_ramassage, Date_de_ramassage,car_model,type,description,nombre_seats,Temps } = req.body;
        
      
    
        const updateObject = {};
        if (name_companies) updateObject.name_companies = name_companies;
        if (prix) updateObject.prix = prix;
        if (Lieu_de_ramassage) updateObject.Lieu_de_ramassage = Lieu_de_ramassage;
        if (Date_de_ramassage) updateObject.Date_de_ramassage = Date_de_ramassage;
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
        const { Nom_Hotel, Prix, Adresse_Hotel, username, Description } = req.body;
        if (!req.file) {
            return res.status(400).send('Photo is required.');
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const Hotel = new HotelSchema({
            Nom_Hotel,
            Adresse_Hotel,
            Photo: result.secure_url,
            Prix,
            username,
            Description
        });
        await Hotel.save();
        console.log("Hotel added");
        res.redirect('/Hotels');
    } catch (error) {
        console.log(error);
    }
};
const responsable_get_Hotels = async (req, res) => {
    try {

        const Hotels = await HotelSchema.find({ username: req.session.username }).sort({ createdAt: -1 });
        res.render('Responsable/Hotels', { Hotels });
    } catch (error) {
        console.log(error);
    }
}
const responsable_editHotel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Photo is required.");
        }

        // Upload the new photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Initialize updateObject if not already initialized
        const updateObject = {};

        // Add the new photo URL to the updateObject
        updateObject.Photo = result.secure_url;

        // Update only the Photo field in the database
        await HotelSchema.findByIdAndUpdate(req.params.id, updateObject, { new: true });

        res.redirect('/Hotels');
    } catch (error) {
        console.error("Error editing hotel:", error);
        res.status(500).send("An error occurred while updating the hotel");
    }
}

const responsable_editHotell_id = async (req, res) => {
    try {
        const HotelInfo = await HotelSchema.findOne({ _id: req.params.id });
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


//affiche review admin
const responsable_getreview = async (req, res) => {
    const reviws = await reviews.find({}).sort({ createdAt: -1 });

    try {
        res.render("responsable/Review", {
           title: "Espace privé resmpnsable",
            reviws,
           
           
        });
    } catch (error) {
        console.log(error);
    }
};

//   delete a review
const responsable_deleteReview = async (req, res) => {
  
    try {
        await reviews.findByIdAndDelete(req.params.id);
        res.redirect('/responsable_reviws'); 
    } catch (err) {
        console.error(err);
    }
};





const getClientReservationsCar = async (req, res) => {
    try {
        const responsableUsername = req.user.username; // Logged-in responsable username

        const cars = await carsShema.find({ username: responsableUsername })

        const Listcarsbyresponsable = cars.map(car => car._id);


        const carReservations = await CarReservation.find({ name_companies: { $in: Listcarsbyresponsable } })
            .populate('name_companies')  
     
           


      
        res.render('Responsable/CarsReservation', { carReservations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const responsable_delete_CarReservation = async (req, res) => {
    try {
        await Car_reservation.findByIdAndDelete(req.params.id);
        res.redirect("/carReservationList");
    } catch (error) {
        console.log('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};



////client reserevation flight integrer ici pour tester this in controller client
const responsable_get_AddflightReservation = async (req, res) => {
    try {
        res.render('Responsable/add-flights',{
            title:"xxxxxxxxx"
        });
    } catch (error) {
        console.log(error);
    }
}
const responsable_AddflightReservation = async (req, res) => {
    try {
        const { name_compagnies, Email, genre, tele, lieu_depart,heure_depart,lieu_arrivee } = req.body;


        if (!name_compagnies || !lieu_depart || !heure_depart || !lieu_arrivee) {
            return res.status(400).send('champs feild is required.');
        }

       
        const flight = await Ticket_flight.findOne({ name_compagnies,lieu_depart,heure_depart,lieu_arrivee });

        if (!flight) {
            return res.status(404).send('flight not found.');
        }

        
        const reservationflight = new flightReservationshema({
            name_compagnies: flight._id,
            Email,
            genre,
            tele,
            lieu_depart,
            lieu_arrivee,
            heure_depart,
        });

        await reservationflight.save();

        res.redirect("/FlightReservationList");
    } catch (error) {
        console.log('Error creating reservationFlight:', error);
        res.status(500).send('Internal Server Error');
    }
};
const responsable_List_FlightReservation= async (req,res)=>{
    try{
    const ListFlight = await flightReservationshema.find().populate('name_compagnies').sort({ createdAt: -1 });
    res.render('Responsable/flightsReservation',
        {
            ListFlight,
            title: "Espace privé resmpnsable",
     
        });
    }catch(error){
        console.log(error);
    }
}
const responsable_edit_flightReservation_id = async (req, res) => {
    try {
        const flightReservInfo = await flightReservationshema.findById(req.params.id).populate('name_compagnies');
        if (!flightReservInfo) {
            return res.status(404).send('Reservation not found.');
        }
      
        res.render("Responsable/edit_FlightReservation", { flightReservInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
const responsable_edit_flightReservation = async (req, res) => {
    try {
        const { name_compagnies, Email, genre, tele, lieu_depart, heure_depart, lieu_arrivee } = req.body;
        const updateObject = {};

        // Validate and set the name_compagnies field
        if (name_compagnies) {
            const flight = await Ticket_flight.findOne({ name_compagnies });
            if (!flight) {
                return res.status(404).send('Flight not found.');
            }
            updateObject.name_compagnies = flight._id;
        }

        // Set other fields if they are present in the request body
        if (Email) updateObject.Email = Email;
        if (genre) updateObject.genre = genre;
        if (tele) updateObject.tele = tele;
        if (lieu_depart) updateObject.lieu_depart = lieu_depart;
        if (heure_depart) updateObject.heure_depart = heure_depart;
        if (lieu_arrivee) updateObject.lieu_arrivee = lieu_arrivee;

        // Update the flight reservation
        await flightReservationshema.findByIdAndUpdate(req.params.id, updateObject, { new: true });
        res.redirect("/flightReservationList");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
const responsable_delete_flightReservation = async (req, res) => {
    try {
        await flightReservationshema.findByIdAndDelete(req.params.id);
        res.redirect("/flightReservationList");
    } catch (error) {
        console.log('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};



/*-------------- Hotel Reservation  Crud -----------*/
//test affiche data bookind client to responsable
const getClientReservations = async (req, res) => {
    try {
        const responsableUsername = req.user.username; // Logged-in responsable username

        // Step 1: Find hotels created by the responsable
        const hotels = await HotelSchema.find({ username: responsableUsername })

        // map tous les hotel crette by reponsabble by id
        const Listhotelesbyresponsable = hotels.map(hotel => hotel._id);

        // Step 2: Find in  HotelReservSchema tous Nom_Hotel == const Listhotelesbyresponsable = hotels.map(hotel => hotel._id);

        const reservations = await HotelReservSchema.find({ Nom_Hotel: { $in: Listhotelesbyresponsable } })
            .populate('Nom_Hotel')  
            console.log(reservations)
           


      
        res.render('Responsable/HotelReservation', { reservations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const responsable_delete_HotelReservation = async (req, res) => {
    try {
        await HotelReservSchema.findByIdAndDelete(req.params.id);
        res.redirect("/HotelReservation");
    } catch (error) {
        console.log('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};

//settings responsable
const responsable_Settings= async (req,res)=>{
    const {username} = req.user
    const responsable = await Responsableshema.findOne({ username });
   
    try{
    res.render('Responsable/responsableSettings',
      
        {
            responsable, 
            title: "Espace privé resmpnsable",
     
        });
    }catch(error){
        console.log(error);
    }
}



//logout responsable 

const responsable_logout = (req, res) => {
    res.clearCookie("responsableToken");
    res.redirect("/responsable");
};

module.exports = {
    login_responsable,
    responsable_login,
    get_card,
    get_dashboard_responsable,

    //CRUD FLIGHTS-reservation
    responsable_get_AddflightReservation,
    responsable_AddflightReservation,
    responsable_List_FlightReservation,
    responsable_edit_flightReservation_id,
    responsable_edit_flightReservation,
    responsable_delete_flightReservation,
    

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
   
    //crud Hotel
    responsable_logout,
    responsable_get_AddHotel,
    responsable_AddHotel,
    responsable_get_Hotels,
    responsable_editHotel,
    responsable_editHotell_id,
    responsable_deleteHotel,
    //Crud Hotel_Reservation
  
    responsable_delete_HotelReservation,

    //responsable review
    responsable_getreview,
    responsable_deleteReview,

    //Reservation Car
  
    responsable_delete_CarReservation,

      //get reservation car and hotel by responsable
      getClientReservations,
      getClientReservationsCar,
      //settings responsable
      responsable_Settings,
};