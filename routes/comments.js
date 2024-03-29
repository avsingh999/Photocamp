var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/new",function(req, res){
  //find by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{campground: campground});
    }
  });
});

router.post("/", isLoggedIn ,function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);

      res.redirect("/campgrounds");
    }
    else{
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            }
            else{
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment)
                res.redirect("/campgrounds/"+campground._id);
            }
        });
        console.log(req.body.comment);
    }
  });
});

router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back")
        }
        else{
          res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});
        }
      });

});
router.put("/:comment_id",checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
    if(err){
      res.redirect("back");
    }
    else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});

//***********delete************

router.delete("/:comment_id",checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }
    else{
      res.redirect("/campgrounds/"+ req.params.id);
    }

  });
});


function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){

        console.log(err);
        res.redirect("back");
      }
      else{
        if(foundComment.auhtor.id.equals(req.user._id)){

          next();
        }
        else{
          res.redirect("back");

        }
      }
    });
  }
  else{

    res.redirect("back");
  }
}





function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login");
}

module.exports = router;
