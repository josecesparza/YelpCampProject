var express = require('express');
var router = express.Router();
var User = require("../models/user");
var middleware = require('../middleware');

router.get("/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render('../views/users/show', { foundUser: foundUser });
        }
    });
});

module.exports = router;