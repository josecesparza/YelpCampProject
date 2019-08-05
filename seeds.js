var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment')

var data = [
    {
        name: "Cloud's Rest",
        price: "10",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            id: "5d40a3e16c0af73254eed23b", //If we deleted this user in the DB, we will have to change this id and username
            username: "jose"
        }
    },
    {
        name: "Desert Mesa",
        price: "10",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            id: "5d40a3e16c0af73254eed23b",
            username: "jose"
        }
    },
    {
        name: "Canyon Floor",
        price: "10",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            id: "5d40a3e16c0af73254eed23b",
            username: "jose"
        }
    }
]

function seedDB() {
    console.log("Seeds function ON!")
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed campgrouds");
        //Add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added campground");
                    //Remove all comments
                    Comment.remove({}, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Comment removed");
                        //Create a comment
                        Comment.create({
                            text: "This is great but I wish there was Internet",
                            author: {
                                id: "5d40a3e16c0af73254eed23b",
                                username: "jose"
                            }
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                //Add a few comments
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    });

                }
            });
        });
    });

}

module.exports = seedDB;