if(process.env.NODE_ENV!="production"){
  require('dotenv').config();

}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Agent = require("./models/agent.js");

const {isLoggedIn} = require("./middleware.js");
const {saveRedirectUrl} = require("./middleware.js");
const listingController = require("./controllers/listing.js");
const userController = require("./controllers/users.js");
const multer  = require('multer');
const {storage} = require("./CloudConfig.js");
const user = require('./models/user.js');
const upload = multer({storage});


//============================= MONGODB SETUP ===================================
// const MONGO_URL = "mongodb://127.0.0.1:27017/sihvirtualhospital";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
};

//============================= SET & USE FILE =====================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//=========================== FOR PARAMS ========================================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/images", express.static("images"));

//========================= FOR SESSION =========================================
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto :{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


store.on("error", () =>{
   console.log("Error in Mongo Session Error", err);
})

  const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
  };
  
  

  app.use(session(sessionOptions));
  app.use(flash());

  //======================= for passports ============================================
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
  });

// =================For Listing Route ===========================
const validateListing = (req, res, next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

app.get("/demoagent", async (req, res) => {
  let fakeagent = new User({
    headache: ['paracetamol', 'ibuprofen'],
    fever: ['paracetamol', 'aspirin'],
    cough: ['cough syrup', 'lozenges'],
    sore_throat: ['lozenges', 'throat spray'],
  });

  let registeruser = await User.register(fakeagent, "helloworld");
  res.send(registeruser);
});

app.get("/", (req, res) =>{
  res.render("listings/home.ejs");
});


//============================ Index Route 1========================
app.get("/listing", 
wrapAsync(listingController.index));
//============================All Index Route 1========================
app.get("/listing/all", 
wrapAsync(listingController.allindex));
//============================ Index Route 2========================
app.get("/listing/one", 
wrapAsync(listingController.indexOne));
//============================ Index Route 3========================
app.get("/listing/two",
wrapAsync(listingController.indexTwo));
//============================ Index Route 4========================
app.get("/listing/three", 
wrapAsync(listingController.indexThree));
//=========================== New Route ============================
app.get("/listings/new",
isLoggedIn,listingController.renderNewForm);
//============================ Show Route =========================
app.get("/listings/:id",
wrapAsync(listingController.showlisting));

//============================Create Route =======================
app.post("/listings",
isLoggedIn,
upload.single("listing[image]"),
validateListing,
wrapAsync(listingController.createListing));

//============================ EDIT ROUTE ==========================================
app.get("/listings/:id/edit",
isLoggedIn,
wrapAsync(listingController.editForm));
//============================= Update Route =======================================
app.put("/listings/:id",
isLoggedIn,
upload.single("listing[image]"),
validateListing,
wrapAsync(listingController.updateListing));

//========================== DELETE ROUTE ==========================================
app.delete( "/listings/:id",
isLoggedIn,
wrapAsync(listingController.destroyListing));


//========================= Talk Route =============================================
app.get("/talks",
isLoggedIn,
(req, res) => {
  res.render("listings/talk.ejs");
});
//=================== This Is a Login Route ======================
//====================== login Route ==============================

//=================== for signup both ========================
app.get("/signup/both", userController.rendersignup);

// ================== For Signup agent Route =======================
app.get("/signup/agent", (req, res) => {
  res.render("users/signup.ejs");
});
app.post("/signup/agent",
   wrapAsync(userController.signupagent));
// ================== For doctor agent Route =======================
app.get("/signup/doctor", (req, res) => {
  res.render("users/signup1.ejs");
});
app.post("/signup/doctor",
   wrapAsync(userController.signupdoctor));

//================== For patient route ===========================
app.get("/signup/patient",(req, res)=>{
  res.render("users/signup2.ejs");
});
app.post("/signup/patient",(req, res)=>{
  wrapAsync(userController.signuppatient)});

// ======================= For Login ======================
app.get("/login",userController.renderLogin);

app.post('/login', 
saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  userController.login
);

// ===================  For Logout ========================
  app.get("/logout",userController.logout);

//============================= For Search Bar ===========================
app.get("/search", async (req, res) => {
  const searchKey = req.query.key; // Extracting search keyword from query parameters
  console.log(searchKey);

  // Performing the search using the provided keyword
  let data = await Listing.find({
    "$or": [
      { "location": { $regex: searchKey, $options: 'i' } }, // Using case-insensitive matching with $options: 'i'
      { "specialist": { $regex: searchKey, $options: 'i' } },
      { "doctorname": { $regex: searchKey, $options: 'i' } },
      { "state": { $regex: searchKey, $options: 'i' } }

    ]
  });
  res.render("listings/search.ejs", { data });
});

// ======================== For My Account ==================
app.get("/myaccount", async (req, res) =>{

  res.render("listings/account.ejs");
 })

app.get("/sagerhos", async (req, res) => {
  const allListings = await Listing.find({location:"Narmadapuram Rd,Bhopal"});
  res.render("listings/sager.ejs", { allListings });
});

app.get("/bansal", async (req, res)=>{
  const allListings = await Listing.find({location:"Narmadapuram Rd,Bhopal"});
  res.render("listings/bansal.ejs", { allListings });
  
});
//====================== mf route ================================
app.get("/medicalfac",(req, res)=>{
  res.render("listings/new2.ejs");
});
app.post("/listings",
isLoggedIn,
upload.single("listing[image]"),
validateListing,
wrapAsync(listingController.createListingmf));

app.get("/bhopalmf", async(req, res)=>{
  const allListings = await Listing.find({area_id: "123"});
  res.render("listings/bhopalmf.ejs", { allListings });
});

app.get("/mfvisit", (req, res) =>{
  res.render("listings/mfvisit.ejs");
})

//========================= for emergency ================
app.get("/women",(req, res)=>{
  res.render("listings/women.ejs");
})
app.get("/child",(req, res)=>{
  res.render("listings/child.ejs");
});
app.get("/searchSym",(req, res)=>{
  res.render("listings/searcpatient.ejs");
});

// ================= For Error =========================
app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res , next) => {
  let {statusCode = 500, message ="Somting Went Wromg !" } = err;
  res.status(statusCode).render("Error.ejs" ,{ message });
  // res.status(statusCode).send(message);
});

// =============================== This Is a Agent Route ===========================

app.listen(3000, () => {
    console.log("server is listening to port 3000");
  });