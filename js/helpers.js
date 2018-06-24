//Require
const Twit = require('twit');
const keys = require('../config.js');
const T = new Twit(keys.keys); //Doc at https://github.com/ttezel/twit
let distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

//This message represent the user's DMs
function createMessage(message){

    let messageObject = {};
    messageObject.id = message.message_create.sender_id; // The message that belongs to other user has a different id than the user
    messageObject.text = message.message_create.message_data.text; // The message itself ... the text
    messageObject.date = distanceInWordsToNow(parseInt(message.created_timestamp), {addSuffix: true});

    // Gets the message name and image using the message id
    // If is different from the user means the message belongs to a friend
    T.get(`https://api.twitter.com/1.1/users/show.json?user_id=${messageObject.id}`, function (err, data, res) {
        
        messageObject.name = data.name;
        messageObject.picture = data.profile_image_url_https;

    });

    return messageObject;
}

//Creates a user object with its data
function createUser(userData){

    let user = {};

    user.name = userData.name;
    user.screenName = `@${userData.screen_name}`;
    user.id = userData.id;
    user.picture = userData.profile_image_url;
    user.background = userData.profile_banner_url;
    user.friendCount = userData.friends_count;

    return user;

}

//Create a new tweet object, this tweet is one of the user's tweets
function createTweet(tweet){

    let tweetObject = {};
    
    tweetObject.text = tweet.text;
    tweetObject.date = distanceInWordsToNow(tweet.created_at, {addSuffix: true});
    tweetObject.retweets = tweet.retweet_count;
    tweetObject.likes = tweet.favorite_count;

    return tweetObject;

}

//Programming can be lonely LOL
// Because the twitter API calls followers as friends I used this name
function createFriend(friend){

    let friendObject = {};

    friendObject.name = friend.name;
    friendObject.screenName = `@${friend.screen_name}`;
    friendObject.picture = friend.profile_image_url;

    return friendObject;
}

//Creates a new tweet
// This function is used when the user post a new tweet
function createNewTweet(reBodyStatus){

    // Creates a new tweet  using the  req.body.status 
    // that is send when the user click post and then update the tweets array
    const tweetObject = {};
    
    // The tweet is new so the only actual data that it has is the message itself
    tweetObject.text = reBodyStatus;
	tweetObject.retweets = 0;
	tweetObject.likes = 0;
    tweetObject.date = distanceInWordsToNow(new Date(), {addSuffix: true});

    return tweetObject;

}

//Export the functions
module.exports.createMessage = createMessage;
module.exports.createUser = createUser;
module.exports.createTweet = createTweet;
module.exports.createFriend = createFriend;
module.exports.createNewTweet = createNewTweet;