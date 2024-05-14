const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    area_id:{
        type:JSON,
        require: true
    },
    email: {
        type: String,
        require : true
    },
    mobile: Number,
    
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Agent', userSchema);