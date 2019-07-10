var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
}); 

var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create({ 
    name: "Granite Hill", 
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
}, function(err, campground){
    if(err){
        console.log(err);
    }else{
        console.log("Newly created campground");
        console.log(campground);
    }
});*/

app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allcampgrounds});
        }
    });
});

//CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - Show form to create a new campground
app.get("/campgrounds/new", function(req, res){
    //Shows the form to add a new campground
    res.render("new");
});

//SHOW - Show page of each campground, show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //Find campground with provited ID
    //Render show template with that campground
    res.render("show");
});

app.listen(3000, process.env.IP, function () {
    console.log("The YelpCamp Server has started!");
});