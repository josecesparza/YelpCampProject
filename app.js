var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function (req, res) {
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
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
    //Shows the form to add a new campground
    res.render("campgrounds/new");
});

//SHOW - Show page of each campground, show more info about one campground
app.get("/campgrounds/:id", function (req, res) {
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

//========================
//COMMENTS ROUTES
//========================
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
            //Render new comment template for that campground
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    //Lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //Create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    //Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();

                    //Redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


app.listen(3000, process.env.IP, function () {
    console.log("The YelpCamp Server has started!");
});