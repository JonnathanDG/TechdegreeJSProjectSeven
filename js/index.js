//Require data
const express = require('express');
const keys = require('../config.js');
const bodyParser = require('body-parser');
const Twit = require('twit');
let distanceInWordsToNow = require('date-fns/distance_in_words_to_now');


//Set the app
const T = new Twit(keys.keys); //Doc at https://github.com/ttezel/twit
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
const router = express.Router();

//Data Arrays
const tweets = [];
const friends = [];
const messages = [];
const user = {};

//Get user Data
T.get('account/verify_credentials',{ skip_status: true }, function(err, data, res, next){

    //Parses the user data if the response
    //Is not an error
    if(!err){

        user.name = data.name;
        user.screenName = `@${data.screen_name}`;
        user.id = data.id;
        user.picture = data.profile_image_url;
        user.background = data.profile_banner_url;
        user.friendCount = data.friends_count;
        
    } else {

        //In case of error then is printed to the console
        console.error(err);
    }

});

//Get user last 5 tweets
T.get('statuses/user_timeline', {count: 5}, function(err, data, res){

    //If there are no errors the data is pushed to tweets array
    if(!err){

        //For each tweet a tweet object is created
        // and pushed to tweets array
        data.forEach(function(tweet){

            let tweetObject = {};
            tweetObject.text = tweet.text;
            tweetObject.date = distanceInWordsToNow(tweet.created_at, {addSuffix: true});
            tweetObject.retweets = tweet.retweet_count;
            tweetObject.likes = tweet.favorite_count;

            tweets.push(tweetObject);
        });

    } else {

        //Display the error in the console
        console.error(err);

        //Sets the error message
        let errorMessage = { text: "We have a problem loading your tweets" };

        // Push the error to the array so can be displayed on the
        // interface
        tweets.push(errorMessage);
    }
});

//Get user friends
T.get('friends/list', { count: 5 }, function(err, data, res){

    //If there are no errors the data is pushed to friends array
    if(!err){

        // For each friend a friend object is created
        // and pushed to friends array
        data.users.forEach(function(friend){

            let friendObject = {};
            friendObject.name = friend.name;
            friendObject.screenName = `@${friend.screen_name}`;
            friendObject.picture = friend.profile_image_url;

            friends.push(friendObject);
        });

    } else {

        //Display the error in the console
        console.error(err);

        //Sets the error message
        let errorMessage = { text: "We have a problem loading your friends data" };

        // Push the error to the array so can be displayed on the
        // interface
        friends.push(errorMessage);
    }
});

//Get user messages
T.get('direct_messages/events/list', { count: 5 }, function(err, data, res){

    //If there are no errors the data is pushed to friends array
    if(!err){

        // For each message a message object is created
        // and pushed to message array
        data.events.forEach(function(message){

            let messageObject = {};
            messageObject.id = message.message_create.sender_id;
            messageObject.text = message.message_create.message_data.text;
            messageObject.date = distanceInWordsToNow(parseInt(message.created_timestamp), {addSuffix: true});

            messages.push(messageObject);
        });

    } else {

        //Display the error in the console
        console.error(err);

        //Sets the error message
        let errorMessage = { text: "We have a problem loading your DMs" };

        // Push the error to the array so can be displayed on the
        // interface
        messages.push(errorMessage);
    }
});



// Loads the index.pug file
router.get('/', (req, res) => {
	res.render('index', { user, tweets, friends, messages });
});








module.exports = router;
