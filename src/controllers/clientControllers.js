const ClientSchema = require("../models/ClientSchema");
const HotelSchema = require("../models/HotelSchema");
const Cars = require("../models/carsShema");
const HotelReservSchema = require("../models/Hotel_ReserSchema");
const Car_reservation = require("../models/Car_reservation");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretClient = process.env.jwtSecretClient;
const ClientReview = require('../models/clientReviewSchema');
const Hotel = require('../models/HotelSchema');

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
                 res.status(200).redirect('/client-Hotel');
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

//get view client_Hotel
const getIndexHotel = async (req, res) => {
    const hotel = await Hotel.find({});

 try{  
        res.render("client/index", {
        query: req.query,
        messages: req.flash(),  
        hotel  ,
          title:'cardHotel'

        });
    } catch (error) {
        console.log(error);
    }
}


//find Hotel
const client_addhotelFind = async (req, res) => {
try{
    const { Adresse_Hotel } = req.body;
    const hotelfind = await Hotel.find({Adresse_Hotel}); 
    


  

    if (!hotelfind) {
        return res.status(404).send('Hotel not found.');
    }

    res.render('client/CardHotel', {
        hotelfind,
    
       
        title:'cardHotel'
     });
    }

    catch (error) {
        res.status(500).send('An error occurred while finding the hotel.');
    }
};
//get view add reservatio
const client_get_AddHotelReservation = async (req, res) => {
    const hotelInfo = await Hotel.find({}); 

    try {
       
        res.render('client/add-HotelReservation',{
            hotelInfo,
        });
    } catch (error) {
        console.log(error);
    }
}
//store reservation  Hotel db
const client_AddHotelReservation = async (req, res) => {
    try {
        const { Nom_Hotel, Nom, Prénom,username, Numéro_Téléphone, Date_entre, Date_sortie, Nombre_Personne, Nombre_Chambre } = req.body;

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
            username,
            Numéro_Téléphone,
            Date_entre,
            Date_sortie,
            Nombre_Personne,
            Nombre_Chambre
        });

        await reservation.save();

        res.redirect("/Cards-reservation");
    } catch (error) {
        console.log('Error creating reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};
//get All reservation Client

const client_getAll_CardReservation = async (req, res) => {
    try {
        const CardReservation = await HotelReservSchema.find({ username: req.session.username }).populate("Nom_Hotel");
        // Calculate the total price for each reservation
        let overallTotalPrice = 0;
        const reservationsWithPrice = CardReservation.map(reservation => {
            const dateEntre = new Date(reservation.Date_entre);
            const dateSortie = new Date(reservation.Date_sortie);
            const days = Math.ceil((dateSortie - dateEntre) / (1000 * 60 * 60 * 24)); //pour convert egalement dateSortie - dateEntre  to days
            const totalPrice = days * reservation.Nom_Hotel.Prix; // Calculate total prix
            overallTotalPrice = overallTotalPrice + totalPrice; // calculate all reservation



            return {
                ...reservation.toObject(),
                totalPrice
            };
        });
        const reservationLength = reservationsWithPrice.length;


        res.render("client/card-Reservation", { 
            CardReservation: reservationsWithPrice,
            overallTotalPrice,
            reservationLength,
            title: 'card Reservation'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

 //GET VIEW EDIT RESERVATION 
 const client_edit_HotelReservation_id = async (req, res) => {
    try {
        const Hotel_ReservInfo = await HotelReservSchema.findById(req.params.id).populate('Nom_Hotel');
        if (!Hotel_ReservInfo) {
            return res.status(404).send('Reservation not found.');
        }
        res.render("client/edit_HotelReservation", { Hotel_ReservInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
//put in db hotel reservation
const client_edit_HotelReservation = async (req, res) => {
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
        res.redirect("/Cards-reservation");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
//Delete client hotel reserver
const client_delete_HotelReservation = async (req, res) => {
    try {
        await HotelReservSchema.findByIdAndDelete(req.params.id);
        res.redirect("/Cards-reservation");
    } catch (error) {
        console.log('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get view index page car
const client_getIndex_car = async (req, res) => {
    const carinfo = await Cars.find({}); 


 try{  
        res.render("client/index-car", {
          title:'client Service',
          carinfo,
        });
    } catch (error) {
        console.log(error);
    }
}

//client Find Car
const client_add_Find_car = async (req, res) => {
    try {
      const { name_companies, Date_de_ramassage, Lieu_de_ramassage, Temps } = req.body;
  
      
      if (!name_companies || !Date_de_ramassage || !Lieu_de_ramassage || !Temps) {
        return res.status(400).send("All fields are required.");
      }
  
      
      const carfind = await Cars.find({ name_companies });
  
     
      if (carfind.length === 0) {
        return res.status(404).send('Car not found.');
      }
      const carfindLength = carfind.length;
  
      res.render("client/cardCars",{
        carfind,
        carfindLength,
        title:"client cards"
      })
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while finding the car.');
    }
};

//CRUD RESRVATION CAR*****************
//GET VIEW ADD CAR RESERVATION
const client_get_AddCarReservation = async (req, res) => {
    const cars = await Cars.find({}) 

    try {
       
        res.render('client/add_carReservation',{
            cars,
            title:"Service Client"
        })
    } catch (error) {
        console.log(error);
    }
}

//store reservation  Hotel db
const client_AddCarReservation = async (req, res) => {
    try {
        const { name_companies, date_sortie_car, date_retourne,Email, genre, tele,Prenom,Nom,username} = req.body;

        if (!name_companies) {
            return res.status(400).send('Nom-Car is required.');
        }

        const car= await Cars.findOne({ name_companies });
       

        if (!car) {
            return res.status(404).send('car not found.');
        }

        const reservationCar = new Car_reservation({
            name_companies: car._id,
            date_sortie_car,
            date_retourne,
            Email,
            genre,
            tele,
            Prenom,
            Nom,
            username,
          
        });

        await reservationCar.save();
        

        res.redirect("/Cards-reservationCar")
    } catch (error) {
        console.log('Error creating reservation:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get All reservation Client

const client_getAll_CardReservationCar = async (req, res) => {
    try {
        let totalallcarsReservation = 0;
        const cardReservationCars = await Car_reservation.find({ username: req.session.username }).populate("name_companies");
        const reservationsCarWithPrice = cardReservationCars.map(reservationcar => {
            const dateSortieVoiture = new Date(reservationcar.date_sortie_car);
            const dateRetourneVoiture = new Date(reservationcar.date_retourne);
            const days = Math.ceil((dateRetourneVoiture - dateSortieVoiture) / (1000 * 60 * 60 * 24)); // Convert date difference to days
            const totalPriceCar = days * reservationcar.name_companies.prix; // Calculate total price using name_companies.prix
            totalallcarsReservation = totalallcarsReservation + totalPriceCar
            return {
                ...reservationcar.toObject(),
                totalPriceCar
            };
        });
        const ReservationLenghtCar= reservationsCarWithPrice.length
        res.render("client/card-ReservationCar", { 
            cardReservationCars,
            reservationsCarWithPrice,
            totalallcarsReservation,
            ReservationLenghtCar,
            title: 'Card Reservation Car'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

 //GET VIEW EDIT RESERVATION 
 const client_edit_carReservation_id = async (req, res) => {
    try {
        const Car_ReservInfo = await Car_reservation.findById(req.params.id).populate('name_companies');
        if (!Car_ReservInfo) {
            return res.status(404).send('Reservation not found.');
        }
        res.render("client/edit_carReservation", { Car_ReservInfo, title:"Service client" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
//put in db hotel reservation
const client_edit_CarReservation = async (req, res) => {
    try {
        const { name_companies, date_sortie_car, date_retourne,Email, genre, tele,Prenom,Nom} = req.body;
        const updateObject = {};

        if (name_companies) {
            const car = await Cars.findOne({ name_companies });
            if (!car) {
                return res.status(404).send('Hotel not found.');
            }
            updateObject.name_companies = car._id;
        }
        if (date_sortie_car) updateObject.date_sortie_car = date_sortie_car;
        if (date_retourne) updateObject.date_retourne = date_retourne;
        if (Email) updateObject.Email = Email;
        if (genre) updateObject.genre = genre;
        if (tele) updateObject.tele = tele;
        if (Prenom) updateObject.Prenom = Prenom;
        if (Nom) updateObject.Nom = Nom;
       

        await Car_reservation.findByIdAndUpdate(req.params.id, updateObject);
        res.redirect("/Cards-reservationCar");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

//Delete client hotel reserver
const client_delete_CarReservation = async (req, res) => {
    try {
        await Car_reservation.findByIdAndDelete(req.params.id);
        res.redirect("/Cards-reservationCar");
    } catch (error) {
        console.log('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
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
    //client find hotel
    getIndexHotel,
    client_addhotelFind,
    //CRUD Reservation Client Hotel
    client_get_AddHotelReservation,
    client_AddHotelReservation,
    client_getAll_CardReservation,
    client_edit_HotelReservation_id,
    client_edit_HotelReservation,
    client_delete_HotelReservation,
    //get index car
    client_getIndex_car,
    //find car
    client_add_Find_car,
   //CRUD CAR RESERVATION
   client_get_AddCarReservation,
   client_AddCarReservation,
   client_getAll_CardReservationCar,
   client_edit_carReservation_id,
   client_edit_CarReservation,
   client_delete_CarReservation,
}