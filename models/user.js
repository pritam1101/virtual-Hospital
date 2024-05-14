const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require : true
    },
    mobile: Number,
    area_id:{
        type:JSON,
        require: true
    },
    
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);