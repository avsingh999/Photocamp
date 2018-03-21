var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");
var User = require("../models/user");

router .get("/", function(req, res){
  res.render("landing",{message: req.flash("error")});
  console.log("yelp start");

});

            // AUTH ROUTS
// ******************************************

  // res.render("register")
  router .get("/register", function(req, res){
    res.render("register")
});

router .post("/register", function(req, res){
  User.register(new User({username:req.body.username}), req.body.password, function(err,User){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  })
});


// *********************************
            // login
// ***********************************


router .get("/login", function(req, res){
  res.render("login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local",
{
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}) ,function(req, res){

});

//**************************************
              // logout
//**************************************

router.get("/logout", function(req, res){
  req.logout();
  req.flash("error", "logged u out");
  res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error","Please login ");
  res.redirect("/login");
}

module.exports = router;
