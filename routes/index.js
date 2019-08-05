var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get("/", function (req, res) {
    res.render("landing");
});

//Show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//Handling sign up logic 
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN FORM
router.get("/login", function (req, res) {
    res.render("login");
});

//Handling login logic
//router.post("/login", middleware, callback);
//When we call passport.authenticate we're calling a method using passport-local-mongoose
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
    }
);

//logout route
router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;