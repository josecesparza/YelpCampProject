var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//INDEX - Show all campgrounds
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }
    });
});

//CREATE - Add new campground to DB
router.post("/", isLoggedIn,function (req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - Show form to create a new campground
router.get("/new", isLoggedIn,function (req, res) {
    //Shows the form to add a new campground
    res.render("campgrounds/new");
});

//SHOW - Show page of each campground, show more info about one campground
router.get("/:id", function (req, res) {
    //Find campground with provited ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Campground Founded: " + foundCampground.name);
            //Render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;