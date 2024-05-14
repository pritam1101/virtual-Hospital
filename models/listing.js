// 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingimage = new Schema({
  doctorname: {
    type: String,
  },
  specialist: {
    type: String,
    // required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  experience: Number,
  state: String,
  location:String,
  country: String,  
  area_id:Number,
  owner :{
    type : Schema.Types.ObjectId,
    ref: "User",
  },
  mobile_no: Number,
  doctor_uid:JSON,

  geometry:  {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },

});

const Listing = mongoose.model("Listing", listingimage);
module.exports = Listing;
