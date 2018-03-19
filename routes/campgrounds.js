var express = require("express");
var router = express.Router();
var Campground  = require("../models/campground");

router .get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }
    else{
      res.render("campgrounds/campgrounds",{allCampgrounds:allCampgrounds, currentUser:req.user,message: req.flash("error")});
    }
  });
});


router.post("/", isLoggedIn, function(req, res){
  var name=req.body.name;
  var image=req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground={name:name, image:image, description:desc,author:author}
  //create new campground and save
  Campground.create(newCampground, function(err, newlyCreates){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/campgrounds");
    }
    })

  // res.redirect("/campgrounds");
});
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new.ejs",{message: req.flash("error")});
});

router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      console.log(err)
    }
    else{
      res.render("campgrounds/show", {campground:foundCampground, message: req.flash("error")});
    }
  });
});


// redirect
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground:foundCampground,message: req.flash("error")});

    });
});

router.put("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});


//**************DESTROY*****************
router.delete("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds");
    }
  });
})


function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "campground not found");
        res.redirect("back");
      }
      else{
        if(foundCampground.auhtor.id.equals(req.user._id)){
          next();
        }
        else{
          req.flash("error", "you don't have permisson");
          res.redirect("back");
        }
      }
    });
  }
  else{
    req.flash("error", "you need to logged in");
    res.redirect("back");
  }
}


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error","Please login");
  res.redirect("/login");
}

module.exports = router;
