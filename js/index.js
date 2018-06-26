//Require data
const express = require('express');
const keys = require('../config.js');
const Twit = require('twit');
const helper = require('./helpers');

//Set the app
const T = new Twit(keys.keys); //Doc at https://github.com/ttezel/twit
const router = express.Router();

//Data Arrays
const tweets = [];
const friends = [];
const messages = [];
let user = {};

//Get user Data
T.get('account/verify_credentials',{ skip_status: true }, function(err, data, res, next){

    //Parses the user data if the response
    //Is not an error
    if(!err){

        user = helper.createUser(data);  
    }
});

//Get user last 5 tweets
T.get('statuses/user_timeline', {count: 5}, function(err, data, res){

    //If there are no errors the data is pushed to tweets array
    if(!err){

        //For each tweet a tweet object is created
        // and pushed to tweets array
        data.forEach(function(tweet){

            tweets.push(helper.createTweet(tweet));
        });
    }
});

//Get user friends
T.get('friends/list', { count: 5 }, function(err, data, res){

    //If there are no errors the data is pushed to friends array
    if(!err){

        // For each friend a friend object is created
        // and pushed to friends array
        data.users.forEach(function(friend){

            friends.push(helper.createFriend(friend));
        });

    }
});

//Get user messages
T.get('direct_messages/events/list', { count: 5 }, function(err, data, res){

    //If there are no errors the data is pushed to friends array
    if(!err){

        // For each message a message object is created
        // and pushed to message array
        data.events.forEach(function(message){

            messages.push(helper.createMessage(message));
        });

    }
});

// POST from form input
router.post('/', (req, res) => {
    
    //Post to twitter
    // https://github.com/ttezel/twit Check post method
	T.post('statuses/update', { status: req.body.status }, (err, data, res) => {

		if (err) {

            console.log("Check internet connection");
        }
    });
    
    //Remove the last element of an array
    tweets.pop(tweets[4]);
            
    // Adds the new tweet as the first element of the array
    tweets.unshift(helper.createNewTweet(req.body.status));
    
    //Renders the index file again
    res.render('index', { user, tweets, friends, messages });
});

// Loads the index.pug file
router.get('/', (req, res) => {

	res.render('index', { user, tweets, friends, messages });
});

//Exports the router
module.exports = router;
