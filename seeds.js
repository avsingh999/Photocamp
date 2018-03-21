var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
console.log("come in seed")
//
var data = [
      {
          name:"Annu ",
          image:"https://lh6.googleusercontent.com/Su3f9QSJx6CqXkjEiOvDzSAAML6RNq9YD6kSCIPov5eudHyou61mN2trSJfydldf067uImrYOPmyFBw7DDlvNSa65vCMSqJ7LLdfcDSgdteYZjE4YQo23vaNooXyhh7xcAkCGCmJ",
          description:"kuch nhi ga wa"
      },
      {
          name:"karan ",
          image:"https://lh6.googleusercontent.com/Su3f9QSJx6CqXkjEiOvDzSAAML6RNq9YD6kSCIPov5eudHyou61mN2trSJfydldf067uImrYOPmyFBw7DDlvNSa65vCMSqJ7LLdfcDSgdteYZjE4YQo23vaNooXyhh7xcAkCGCmJ",
          description:"kuch nhi ga wa"
      },
      {
          name:"Mannu",
          image:"https://lh6.googleusercontent.com/Su3f9QSJx6CqXkjEiOvDzSAAML6RNq9YD6kSCIPov5eudHyou61mN2trSJfydldf067uImrYOPmyFBw7DDlvNSa65vCMSqJ7LLdfcDSgdteYZjE4YQo23vaNooXyhh7xcAkCGCmJ",
          description:"kuch nhi ga wa"
      }
]

function seedDB(){
  //Remove all campground
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("campground removed");
    data.forEach(function(seed){
        Campground.create(seed, function(err,campground){
            if(err){
                console.log(err);
            }
            else{
                console.log("add campground");
                Comment.create(
                    {
                        text:"tgrea",
                        author:"visitor"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("new comment");
                        }
                });
            }
        });
    });
  });
}

module.exports = seedDB;
