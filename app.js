var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    User = require('./models/user'),
    seedDB = require("./seeds");

//Requiring Routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Seed the database
//seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "This is the Secret Page Test",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This middleware function will be called on every route
app.use(function(req, res, next){
    //We're passing the user info
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", indexRoutes);
//All routes in campgroundRoutes start with /campgrounds by default
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function () {
    console.log("The YelpCamp Server has started!");
});