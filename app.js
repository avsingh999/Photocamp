var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override")
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v10");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.use(flash())

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"YELP CAMP",
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.message = req.flash("error");
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(5051, 'localhost',function(){
  console.log("yelp start");
});
