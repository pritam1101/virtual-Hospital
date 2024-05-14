const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
       doctorname : Joi.string().required(),
       specialist : Joi.string(),
       location :Joi.string().required(),
       country :Joi.string().required(),
       state :Joi.string().required(),
       doctor_uid:Joi.number(),
       area_id:Joi.number(),
       experience : Joi.number().min(0).max(20), 
       mobile_no : Joi.number().required().min(10), 
       image : Joi.string().allow("", null)
    }).required(),
});
// // ============================ FOR REVIEW VALIDATION ===============================
//  module.exports.reviewSchema = Joi.object({
//     review : Joi.object({
//           rating : Joi.number().required().min(1).max(5),
//           comment :Joi.string().required(),
//         }).required(),
//  })