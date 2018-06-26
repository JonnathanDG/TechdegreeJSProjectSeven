//Require
const Twit = require('twit');
const keys = require('../config.js');
const T = new Twit(keys.keys); //Doc at https://github.com/ttezel/twit
let distanceInWordsToNow = require('date-fns/distance_in_words_to_now');


//This message represent the user's DMs
function createMessage(messageData){

    let message = {};
    message.id = messageData.message_create.sender_id; // The message that belongs to other user has a different id than the user
    message.text = messageData.message_create.message_data.text; // The message itself ... the text
    message.date = distanceInWordsToNow(parseInt(messageData.created_timestamp), {addSuffix: true});

    // Gets the message name and image using the message id
    // If is different from the user means the message belongs to a friend
    // https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-show.html
    T.get("https://api.twitter.com/1.1/users/show.json?user_id=" + message.id, function (err, data, res) {
        
        if(!err){
            message.name = data.name;
            message.picture = data.profile_image_url_https;
        }    
    });

    return message;
}

//Creates a user object with its data
function createUser(userData){

    let user = {};

    user.name = userData.name;
    user.screenName = "@" + userData.screen_name;
    user.id = userData.id_str;
    user.picture = userData.profile_image_url;
    user.background = userData.profile_banner_url;
    user.friendCount = userData.friends_count;

    return user;
}

//Create a new tweet object, this tweet is one of the user's tweets
function createTweet(tweetData){

    let tweet = {};
    
    tweet.text = tweetData.text;
    tweet.date = distanceInWordsToNow(tweetData.created_at, {addSuffix: true});
    tweet.retweets = tweetData.retweet_count;
    tweet.likes = tweetData.favorite_count;

    return tweet;
}

//Programming can be lonely LOL
// Because the twitter API calls followers as friends I used this name
function createFriend(friendData){

    let friend = {};

    friend.name = friendData.name;
    friend.screenName = "@" + friendData.screen_name;
    friend.picture = friendData.profile_image_url;

    return friend;
}

//Creates a new tweet
// This function is used when the user post a new tweet
function createNewTweet(reBodyStatus){

    // Creates a new tweet  using the  req.body.status 
    // that is send when the user click post and then update the tweets array
    let tweet = {};
    
    // The tweet is new so the only actual data that it has is the message itself
    tweet.text = reBodyStatus;
	tweet.retweets = 0;
	tweet.likes = 0;
    tweet.date = distanceInWordsToNow(new Date(), {addSuffix: true});

    return tweet;
}

//Export the functions
module.exports.createMessage = createMessage;
module.exports.createUser = createUser;
module.exports.createTweet = createTweet;
module.exports.createFriend = createFriend;
module.exports.createNewTweet = createNewTweet;