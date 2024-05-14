const User = require("../models/user.js");
const Agent = require("../models/agent.js");


//============== For Signup Form ==============
module.exports.rendersignup =  (req, res) =>{
    res.render("users/mfdsignup.ejs");
  }
//============== For Signup Doctor =====================
module.exports.signupdoctor =async(req, res, next) => {
    try{
  let {username, email,mobile,doctor_uid, password} = req.body;
  const newUser = new User({email, username,mobile,doctor_uid});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser);
  req.login(registeredUser, (err) => {
     if(err){
      return next(err);
     }
     req.flash("success", "Welcome to Virtual Hospital !");
     res.redirect("/");
  });
    }catch(e){
      req.flash("error", e.message);
      res.redirect("/signup1");
    }
}

// ============== signup For agent  =====================
module.exports.signupagent =async(req, res, next) => {
    try{
  let {username, email,mobile, password,area_id} = req.body;
  const newUser = new User({email, username,mobile,area_id});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser);
  req.login(registeredUser, (err) => {
     if(err){
      return next(err);
     }
     req.flash("success", "Welcome to Virtual Hospital !");
     res.redirect("/");
  });
    }catch(e){
      req.flash("error", e.message);
      res.redirect("/signup");
    }
}
// ============== signup For agent  =====================
module.exports.signuppatient =async(req, res, next) => {
  try{
let {username, email,mobile, password,area_id} = req.body;
const newUser = new User({email, username,mobile,area_id});
const registeredUser = await User.register(newUser, password);
console.log(registeredUser);
req.login(registeredUser, (err) => {
   if(err){
    return next(err);
   }
   req.flash("success", "Welcome to Virtual Hospital !");
   res.redirect("/");
});
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup/patient");
  }
}


//==================== For Login =======================
module.exports.renderLogin =  (req, res )=>{
    res.render("users/login.ejs");
  }

  module.exports.login = function(req, res) {
    req.flash("success","Welcome back to Virtual Hospital! ");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
  }

//======================= For Logout ========================
module.exports.logout =  (req, res, next) => {
    req.logout((err) =>{
     if(err){
       return next(err);
     }
     req.flash("success", "You are Logged Out!");
     res.redirect("/");
    })
 }