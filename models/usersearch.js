const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const newschema = new Schema({
    headache: String,
    fever: String ,
    cough: String,
    sore_throat: String,
    
});

newschema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', newschema);