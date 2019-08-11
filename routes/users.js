var express = require('express');
var router = express.Router();
var User = require("../models/user");
var middleware = require('../middleware');

//SHOW ROUTE
router.get("/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render('../views/users/show', { foundUser: foundUser });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            res.redirect("back");
        } else {
            res.render('users/edit', { foundUser: foundUser });
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkUserOwnership, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/user/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkUserOwnership, function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", err);
            res.redirect("back");
        } else{
            req.flash("success", "User deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;