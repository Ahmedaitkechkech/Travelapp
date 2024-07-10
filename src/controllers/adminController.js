
const Admintravel = require("../models/AdminTravelSchema");
const Responsabelsschema = require("../models/responsableShema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;



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
                const adminToken = jwt.sign({ adminId: admin._id },jwtSecret);
                res.cookie("adminToken", adminToken, { httpOnly: true });
                res.status(200).redirect("/dashborad");
                break;
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/admin");
    }
};


//get dashboard
const get_dashboard_admin = async (req, res) => {
    const admin = await Admintravel.findOne({})
    
    try {
        res.render("Admin/dashboard", {
            title: "place admin",
            admin,

            
        });
    } catch (error) {
        console.log(error);
    }
};


//logout admin
const admin_logout = (req, res) => {
    res.clearCookie("adminToken");
    res.redirect("/admin");
};


// -----------------------curd resapnsable-------------------------------

//get all responssables
const admin_responsables = async (req,res)=>{
    try{
     const Respnsables = await Responsabelsschema.find().sort({createdAt:-1});
     res.render('admin/Responables', {
        title: "Place admin",
        Respnsables
    }
     );
    }catch(error){
         console.log(error);
    }
}

// get view add respo
const admin_get_AddResponssable = async (req, res) => {
    try {
        res.render("admin/add-Responsable", {
            title: "Espace privé Admin",
        });
    } catch (error) {
        console.log(error);
    }
};

// add  respo db
const admin_Add_Responssable = async (req, res) => {
    try {
        const {
            CIN, name_Responsable, name_companies, birthday, birthplace,num_tel ,email, password,type } = req.body;

   
        const newResponsable = AddRespo({
            CIN, name_Responsable, name_companies, birthday, birthplace,num_tel ,email, password,type});

        await AddRespo.create(newResponsable);
        req.flash("success","Responsable has been saved successfully!");
        res.render('admin/add-responsable',{
            messages:req.flash()
        });
       
        res.redirect("/responsables");
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//get responsable by id
const admin_edit_responsable_id = async (req, res) => {
    try {
        
        const respo = await Responsabelsschema.findOne({ _id: req.params.id }).select("-password");
        res.render("admin/edit-responsable", {
            respo,
            title: "Espace privé Admin",        
            
        });
    } catch (error) {
        console.log(error);
    }
};

//admin edit reponsable by id 

const admin_edit_responsable = async (req, res) => {
    try {
      const {CIN, name_Responsable, name_companies, birthday, birthplace,num_tel ,email, password,type } = req.body;
    
  
      const updateObject = {};
        if (CIN) updateObject.CIN = CIN;
        if (name_Responsable) updateObject.name_Responsable = name_Responsable;
        if (name_companies) updateObject.name_companies = name_companies;
        if (birthday) updateObject.birthday = birthday;
        if (birthplace) updateObject.birthplace = birthplace;
        if (num_tel) updateObject.num_tel = num_tel;
        if (email) updateObject.email = email;
        if (password) updateObject.password = password;
        if (type) updateObject.type = type;
        
  
      await Responsabelsschema.findByIdAndUpdate(req.params.id, updateObject);

      res.redirect("/responsables");
    } catch (error) {
      console.log(error);
    }
};

// admin_delete_responsable
const admin_delete_responsable = async (req, res) => {
    try {
        await Responsabelsschema.deleteOne({ _id: req.params.id });
        res.redirect("/responsables");
    } catch (error) {
        console.log(error);
    }
};
// admin_get_Settings
const admin_get_Settings = async (req,res)=>{
    try{
     res.render("Admin/Settings");

    }catch(error){
        console.log(error);
    }
}


module.exports = {
    loginAuth,
    admin_login,
    get_dashboard_admin,
    admin_logout,

    //CRUD RESPONSABLE
    admin_get_AddResponssable ,
    admin_Add_Responssable,
    admin_responsables,
    admin_edit_responsable_id ,
    admin_edit_responsable,
    admin_delete_responsable,
    admin_get_Settings

}