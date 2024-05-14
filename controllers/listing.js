const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//=================== For Index 1 =====================
module.exports.index = 
    async (req, res) => {
        const allListings = await Listing.find({specialist: "General Physician"});
        res.render("listings/index1.ejs", { allListings });
      };

//============================All Index Route 1========================
module.exports.allindex = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/indexall.ejs", { allListings });
  } 
//============================ Index Route 2========================
module.exports.indexOne = async (req, res) => {
    const allListings = await Listing.find({specialist: "Dermatology"});
    res.render("listings/index2.ejs", { allListings });
   }

//============================ Index Route 2========================
module.exports.indexTwo = async (req, res) => {
    const allListings = await Listing.find({specialist: "Gastroenterology"});
    res.render("listings/index3.ejs", { allListings });
   }

//============================ Index Route 3========================
module.exports.indexThree = async (req, res) => {
    const allListings = await Listing.find({ specialist: 'Cardiology'});
    res.render("listings/index4.ejs", { allListings });
   }

//================== For New =========================
module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new1.ejs");
  }  
//================== For Show ========================
  module.exports.showlisting = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing){
     req.flash("success", "Listing You requested dose not exist !");
     res.redirect("/listing");
   }
    res.render("listings/show1.ejs", {listing});
   }

// =================== For Create Route ====================
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
console.log(response.body.features[0].geometry);

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Doctor Added !");
    console.log(newListing);
    res.redirect("/listing");
    }   

// =================== For Create Route ====================
module.exports.createListingmf = async (req, res) => {
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
console.log(response.body.features[0].geometry);

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    // newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Medical Facilirator Added !");
    console.log(newListing);
    res.redirect("/");
    }   



 //================== Edit Form =====================
 module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("success", "Listing You requested dose not exist !");
      res.redirect("/listing");
    }
    res.render("listings/edit1.ejs", { listing });
    }
// ======================== Update Listing ================
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image =  {url, filename};
   await listing.save();
    }
    req.flash("success", "Doctor Listing Updated !");
    res.redirect(`/listings/${id}`);
  }
//======================= Delete Listing ===================
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Doctor Listing Deleted !");
    res.redirect("/listing/all");
    }