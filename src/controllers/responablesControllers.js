const { cloudinary } = require("../../utils/cloudinary");
const Responsableshema = require("../models/responsableShema");
const HotelSchema = require("../models/HotelSchema");
const Car_reservation = require("../models/Car_reservation");
const flightshema = require("../models/flightsSchema"); 
const Ticket_flight = require("../models/Ticket_flight"); 
const carsShema = require("../models/carsShema"); 
const reviews = require("../models/clientReviewSchema"); 

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
        const { Nom_Hotel, Adresse_Hotel, username, Description, Prix } = req.body;
        const HotelUpdate = {
            Nom_Hotel,
            Adresse_Hotel,
            username,
            Description,
            Prix
        };
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            HotelUpdate.Photo = result.secure_url;
        }
        
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
const responsable_get_AddHotelReservation = async (req, res) => {
    try {
        res.render('Responsable/add-HotelReservation');
    } catch (error) {
        console.log(error);
    }
}

const responsable_AddHotelReservation = async (req, res) => {
    try {
        const { Nom_Hotel, Nom, Prénom, Numéro_Téléphone, Date_entre, Date_sortie, Nombre_Personne, Nombre_Chambre } = req.body;

        if (!Nom_Hotel) {
            return res.status(400).send('Nom_Hotel is required.');
        }

        const hotel = await HotelSchema.findOne({ Nom_Hotel });

        if (!hotel) {
            return res.status(404).send('Hotel not found.');
        }

        const reservation = new HotelReservSchema({
            Nom_Hotel: hotel._id,
            Nom,
            Prénom,
            Numéro_Téléphone,
            Date_entre,
            Date_sortie,
            Nombre_Personne,
            Nombre_Chambre
        });

        await reservation.save();

        res.redirect("/HotelReservation");
    } catch (error) {
        console.log('Error creating reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};

const responsable_List_HotelReservation= async (req,res)=>{
    try{
    const ListHotel = await HotelReservSchema.find().populate('Nom_Hotel').sort({ createdAt: -1 });
    res.render('Responsable/HotelReservation',{ListHotel});
    }catch(error){
        console.log(error);
    }
}
const responsable_edit_HotelReservation_id = async (req, res) => {
    try {
        const Hotel_ReservInfo = await HotelReservSchema.findById(req.params.id).populate('Nom_Hotel');
        if (!Hotel_ReservInfo) {
            return res.status(404).send('Reservation not found.');
        }
        console.log(Hotel_ReservInfo); // Add this line
        res.render("Responsable/edit_HotelReservation", { Hotel_ReservInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const responsable_edit_HotelReservation = async (req, res) => {
    try {
        const { Nom_Hotel, Nom, Prénom, Numéro_Téléphone, Date_entre, Date_sortie, Nombre_Personne, Nombre_Chambre } = req.body;
        const updateObject = {};

        if (Nom_Hotel) {
            const hotel = await HotelSchema.findOne({ Nom_Hotel });
            if (!hotel) {
                return res.status(404).send('Hotel not found.');
            }
            updateObject.Nom_Hotel = hotel._id;
        }
        if (Nom) updateObject.Nom = Nom;
        if (Prénom) updateObject.Prénom = Prénom;
        if (Numéro_Téléphone) updateObject.Numéro_Téléphone = Numéro_Téléphone;
        if (Date_entre) updateObject.Date_entre = Date_entre;
        if (Date_sortie) updateObject.Date_sortie = Date_sortie;
        if (Nombre_Personne) updateObject.Nombre_Personne = Nombre_Personne;
        if (Nombre_Chambre) updateObject.Nombre_Chambre = Nombre_Chambre;

        await HotelReservSchema.findByIdAndUpdate(req.params.id, updateObject);
        res.redirect("/HotelReservation");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
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


//client reserevation integrer ici pour tester this in controller client
const responsable_get_AddcarReservation = async (req, res) => {
    try {
        res.render('Responsable/add_carReservation');
    } catch (error) {
        console.log(error);
    }
}

const responsable_AddCarReservation = async (req, res) => {
    try {
        const { name_companies, nombre_jour, prix_total, Email, genre, tele } = req.body;

        if (!name_companies) {
            return res.status(400).send('name_companies is required.');
        }

       
        const car = await carsShema.findOne({ name_companies:req.body.name_companies });

        if (!car) {
            return res.status(404).send('Car not found.');
        }

        // Create the reservation with the car's ObjectId
        const reservationcar = new Car_reservation({
            name_companies: car._id,
            nombre_jour,
            prix_total,
            Email,
            genre,
            tele
        });

        await reservationcar.save();

        res.redirect("/carReservationList");
    } catch (error) {
        console.log('Error creating reservationCar:', error);
        res.status(500).send('Internal Server Error');
    }
};

const responsable_List_CarReservation= async (req,res)=>{
    try{
    const ListCar = await Car_reservation.find().populate('name_companies').sort({ createdAt: -1 });
    res.render('Responsable/carReservationList',
        {
            ListCar,
            title: "Espace privé resmpnsable",
     
        });
    }catch(error){
        console.log(error);
    }
}

const responsable_edit_CarReservation_id = async (req, res) => {
    try {
        const CarReservInfo = await Car_reservation.findById(req.params.id).populate('name_companies');
        if (!CarReservInfo) {
            return res.status(404).send('Reservation not found.');
        }
      
        res.render("Responsable/edit_CarReservation", { CarReservInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const responsable_edit_CarReservation = async (req, res) => {
    try {
        const { name_companies, nombre_jour, prix_total, Email, genre, tele } = req.body;
        const updateObject = {};

        if (name_companies) {
            const car = await carsShema.findOne({ name_companies });
            if (!car) {
                return res.status(404).send('car not found.');
            }
            updateObject.name_companies = name_companies._id;
        }
        if (nombre_jour) updateObject.nombre_jour = nombre_jour;
        if (prix_total) updateObject.prix_total = prix_total;
        if (Email) updateObject.Email = Email;
        if (genre) updateObject.genre = genre;
        if (tele) updateObject.tele = tele;
        

        await Car_reservation.findByIdAndUpdate(req.params.id, updateObject);
        res.redirect("/carReservationList");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
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
   
    //crud Hotel
    responsable_logout,
    responsable_get_AddHotel,
    responsable_AddHotel,
    responsable_get_Hotels,
    responsable_editHotel,
    responsable_editHotell_id,
    responsable_deleteHotel,
    //Crud Hotel_Reservation
    responsable_get_AddHotelReservation,
    responsable_AddHotelReservation,
    responsable_List_HotelReservation,
    responsable_edit_HotelReservation_id,
    responsable_edit_HotelReservation,
    responsable_delete_HotelReservation,

    //responsable review
    responsable_getreview,
    responsable_deleteReview,

    //Reservation Car
    responsable_get_AddcarReservation,
    responsable_AddCarReservation,
    responsable_List_CarReservation,
    responsable_edit_CarReservation_id,
    responsable_edit_CarReservation,
    responsable_delete_CarReservation,
};