const Admintravel = require("../models/AdminTravelSchema");
const Responsable = require("../models/responsableShema"); 
const Car = require("../models/carsShema"); 
const Flight = require("../models/Ticket_flight"); 
const Hotel = require("../models/HotelSchema"); 
const reviews = require("../models/clientReviewSchema"); 
const HotelResrvation = require("../models/Hotel_ReserSchema"); 
const car_reservation = require("../models/Car_reservation"); 
const flightReservationshema = require("../models/flightsReservation"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;


const registerAdmin = async (req, res) => {
    try {
        const { username, email, tele, password, role } = req.body;
        console.log(req.body)

        if (!username || !email || !tele || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingAdmin = await Admintravel.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = new Admintravel({
            username,
            email,
            tele,
            role,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



// login page
const loginAuth = async (req, res) => {
    try {
        res.render("Admin/Login", {
            title: "place admin",
            query: req.query,
            messages: req.flash(),
        });
    } catch (error) {
        console.log(error);
    }
};

// admin-login
const admin_login = async (req, res) => {
    let admin;
    try {
        const { username, password } = req.body;
        let errorType = "";

        if (!username || !password) {
            errorType = "missingCredentials";
        } else {
            admin = await Admintravel.findOne({ username });
            if (!admin) {
                errorType = "invalidLogin";
            } else if (password.length < 5) {
                errorType = "passwordTooShort";
            } else {
                const ifPwdValid = await bcrypt.compare(password, admin.password);
                if (!ifPwdValid) {
                    errorType = "invalidLogin";
                }
            }
        }

        switch (errorType) {
            case "missingCredentials":
                req.flash("error", "Username and password are required.");
                res.status(401).redirect("/admin");
                break;
            case "passwordTooShort":
                req.flash("error", "Password must be at least 5 characters long.");
                res.status(401).redirect("/admin");
                break;
            case "invalidLogin":
                req.flash("error", "Invalid username or password.");
                res.status(401).redirect("/admin");
                break;
            default:
                const adminToken = jwt.sign({ adminId: admin._id }, jwtSecret);
                res.cookie("adminToken", adminToken, { httpOnly: true });
                res.status(200).redirect("/dashboard");
                break;
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/admin");
    }
};

// get dashboard
const get_dashboard_admin = async (req, res) => {
    const admin = await Admintravel.findOne({});
    const responsables = await Responsable.find().sort({ createdAt: -1 });
    const Hoteles = await Hotel.find({}).sort({ createdAt: -1 }).limit(4)
    const Cars = await Car.find({}).sort({ createdAt: -1 }).limit(6)
    const Flights = await Flight.find({}).sort({ createdAt: -1 }).limit(6)
    const hotelCount = await Hotel.countDocuments({});
    const carCount = await Car.countDocuments({});
    const flifgtCount = await Flight.countDocuments({});





    
    try {
        res.render("Admin/dashboard", {
            title: "place admin",
            admin,
            responsables,
            Hoteles,
            Cars,
            Flights,
            flifgtCount,
            carCount,
            hotelCount,
        });
    } catch (error) {
        console.log(error);
    }
};

// logout admin
const admin_logout = (req, res) => {
    res.clearCookie("adminToken");
    res.redirect("/admin");
};

// ----------------------- CRUD responsable -------------------------------

// get all responsables
const admin_responsables = async (req, res) => {
    try {
        const responsables = await Responsable.find().sort({ createdAt: -1 });
        res.render('Admin/Responables', {
            title: "Place admin",
            responsables,
        });
    } catch (error) {
        console.log(error);
    }
}

// get view add responsable
const admin_get_AddResponsable = async (req, res) => {
    try {
        res.render("admin/add-Responsable", {
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
    }
};

// add responsable to db
const admin_Add_Responsable = async (req, res) => {
    try {
        const {
            name_Responsable, name_companies, birthday, birthplace, num_tel, email, username, password,
        } = req.body;

        // Validate required fields
        if (!username || !password || !name_Responsable || !name_companies || !num_tel || !birthplace || !email ) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        const newResponsable = new Responsable({
            name_Responsable, name_companies, birthday, birthplace, num_tel, email, username, password, 
        });

        await newResponsable.save(); 
        req.flash("success", "Responsable has been saved successfully!");

        res.redirect("/responsables");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// get responsable by id
const admin_edit_responsable_id = async (req, res) => {
    try {
        const respo = await Responsable.findOne({ _id: req.params.id }).select("-password");
        res.render("admin/edit-responsable", {
            respo,
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
    }
};

// edit responsable by id
const admin_edit_responsable = async (req, res) => {
    try {
        const { CIN, name_Responsable, name_companies, birthday, birthplace, num_tel, email, password, } = req.body;

        const updateObject = {};
        if (CIN) updateObject.CIN = CIN;
        if (name_Responsable) updateObject.name_Responsable = name_Responsable;
        if (name_companies) updateObject.name_companies = name_companies;
        if (birthday) updateObject.birthday = birthday;
        if (birthplace) updateObject.birthplace = birthplace;
        if (num_tel) updateObject.num_tel = num_tel;
        if (email) updateObject.email = email;
        if (password) updateObject.password = await bcrypt.hash(password, 10); 
        

        await Responsable.findByIdAndUpdate(req.params.id, updateObject);

        res.redirect("/responsables");
    } catch (error) {
        console.log(error);
    }
};

// delete responsable
const admin_delete_responsable = async (req, res) => {
    try {
        await Responsable.deleteOne({ _id: req.params.id });
        res.redirect("/responsables");
    } catch (error) {
        console.log(error);
    }
};

// get settings
const admin_get_Settings = async (req, res) => {
    const infoAdmin  = await Admintravel.find({})
    try {
        res.render("Admin/Settings",{
            infoAdmin,
        });
    } catch (error) {
        console.log(error);
    }
}

//afiche les clients to admin

const admin_clients = async (req, res) => {
    try {
        res.render("Admin/clients", {
            title: "place admin",
           
        });
    } catch (error) {
        console.log(error);
    }
};

//afiche les Hoteles to admin

const admin_Hoteles = async (req, res) => {
    const Hoteles = await Hotel.find({}).sort({ createdAt: -1 })
    try {
        res.render("Admin/hoteles", {
            title: "place admin",
            Hoteles,
           
        });
    } catch (error) {
        console.log(error);
    }
};

//afiche les cars to admin

const admin_cars = async (req, res) => {
    const cars = await Car.find({}).sort({ createdAt: -1 });

    try {
        res.render("Admin/cars", {
            title: "place admin",
            cars,
           
           
        });
    } catch (error) {
        console.log(error);
    }
};
//afiche les cars to admin

const admin_flights = async (req, res) => {
    const flights = await Flight.find({}).sort({ createdAt: -1 });

    try {
        res.render("Admin/flights", {
            title: "place admin",
            flights,
           
        });
    } catch (error) {
        console.log(error);
    }
};


//admin get agentList


const admin_get_allAgennt_list = async (req, res) => {
    try {
        const agents = await Responsable.find();
        

        const agentDetails = await Promise.all(agents.map(async agent => {
            const flightCount = await Flight.countDocuments({ username: agent.username });
            const carCount = await Car.countDocuments({ username: agent.username });
            const hotelCount = await Hotel.countDocuments({ username: agent.username });

            return {
                ...agent.toObject(),
                flightCount,
                carCount,
                hotelCount,
            };
        }));

        res.render("admin/agantList", { title:"place admin",
            agents: agentDetails });
    } catch (err) { 
        res.status(500).send(err.message);
    }
};


const admin_get_Agent_by_id = async (req, res) => {
    try {
        const agentId = req.params.id; // Assuming the agent ID is passed as a URL parameter
        const agent = await Responsable.findById(agentId);
       

        if (!agent) {
            return res.status(404).send("Agent not found");
        }

        // Count the number of flights and cars for the agent
        const flightCount = await Flight.countDocuments({ username: agent.username });
        const carCount = await Car.countDocuments({ username: agent.username });
        const hotelCount = await Hotel.countDocuments({ username: agent.username });

        res.render("admin/detail-Agent", {
            agent: {
                ...agent.toObject(),
                flightCount,
                carCount,
                hotelCount,
            },
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};


const admin_review = async (req, res) => {
    const reviws = await reviews.find({}).sort({ createdAt: -1 });

    try {
        res.render("Admin/Review", {
            title: "place admin",
            reviws,
           
           
        });
    } catch (error) {
        console.log(error);
    }
};

//   delete a review
const admin_deleteReview = async (req, res) => {
  
    try {
        await reviews.findByIdAndDelete(req.params.id);
        res.redirect('/reviws'); 
    } catch (err) {
        console.error(err);
    }
}

// get All reservation cars to admin
const admin_get_Allcars_Booking = async (req, res) => {
    try {
        const carReservationAdmin = await car_reservation.find({}).populate('name_companies');
       
       

        res.render('Admin/Cars-Rservation.ejs', {
            title: "Place Admin",
            carReservationAdmin,
            
        });
    } catch (err) {
        console.error("Error fetching car reservations:", err);
        res.status(500).send("Internal Server Error");
    }
};

// get All reservation Hoteles to admin
const admin_get_Allhoteles_Booking = async (req, res) => {
    try{
        const hotelReservationAdmin =  await HotelResrvation.find({}).populate('Nom_Hotel')
        res.render('Admin/Hoteles-Rservation',{
            title:"Place Admin",
            hotelReservationAdmin,

        })
    } catch (err) {
        console.error("Error fetching hotel reservations:", err);
        res.status(500).send("Internal Server Error");
    }
  
}

//get client car and hotel to admin
const admin_getClientClientCarAndHotel  = async (req, res) => {
    try {
        

        // Fetch car data
        const clientCars = await Car.find({});
        const ListClientcarsbyresponsable = clientCars.map(car => car._id);

        const clientCarList = await car_reservation.find({ name_companies: { $in: ListClientcarsbyresponsable } })
            .populate('name_companies').sort({ createdAt: -1 });

        // Fetch hotel data
        const hotels = await Hotel.find({});
        const Listhotelesbyresponsable = hotels.map(hotel => hotel._id);

        const clientHotelList = await HotelResrvation.find({ Nom_Hotel: { $in: Listhotelesbyresponsable } })
            .populate('Nom_Hotel').sort({ createdAt: -1 });

        // Fetch flight data
        const flights = await Flight.find({});
        const ListClientflightbyresponsable = flights.map(flight => flight._id);

        const clientFlightList = await flightReservationshema.find({ name_compagnies: { $in: ListClientflightbyresponsable } })
            .populate('name_compagnies').sort({ createdAt: -1 });

        // Combine car, hotel, and flight reservations
        const combinedReservations = [
            ...clientCarList.map(car => ({
                type: 'Car',
                Nom: car.Nom,
                Prenom: car.Prenom,
                tele: car.tele,
            })),
            ...clientHotelList.map(hotel => ({
                type: 'Hotel',
                Nom: hotel.Nom,
                Prenom: hotel.Prénom,
                tele: hotel.Numéro_Téléphone,
            })),
            ...clientFlightList.map(flight => ({
                type: 'Flight',
                Nom: flight.Nom,
                Prenom: flight.Prenom,
                tele: flight.tele,
            })),
        ];

        res.render('Responsable/clients', { combinedReservations });
    } catch (error) {
        console.error("Error fetching client reservations:", error);
        res.status(500).send('Server Error');
    }
};




module.exports = {
    loginAuth,
    admin_login,
    get_dashboard_admin,
    registerAdmin,
    // CRUD Responsable
    admin_get_AddResponsable,
    admin_Add_Responsable,
    admin_responsables,
    admin_edit_responsable_id,
    admin_edit_responsable,
    admin_delete_responsable,
    admin_get_Settings,

    //afiche les client to admin
    admin_clients,
    //afiche les admin_Hoteles to admin
    admin_Hoteles,
    //afiche les admin_cars to admin
    admin_cars,
    //afiche les admin_flights to admin
    admin_flights,

    //Agent List
    admin_get_allAgennt_list,
    admin_get_Agent_by_id,

    //affiche reviws
    admin_review,
    admin_deleteReview,

    //afiche hotelesRervation and cars and flight
    admin_get_Allhoteles_Booking,
    admin_get_Allcars_Booking,
    //admin get client car and Hotel
    admin_getClientClientCarAndHotel,

    admin_logout,
    
    

   
}
;
