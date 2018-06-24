//Require
const Twit = require('twit');
const keys = require('../config.js');
const T = new Twit(keys.keys); //Doc at https://github.com/ttezel/twit
let distanceInWordsToNow = require('date-fns/distance_in_words_to_now');


function createMessage(message){

    let messageObject = {};
    messageObject.id = message.message_create.sender_id;
    messageObject.text = message.message_create.message_data.text;
    messageObject.date = distanceInWordsToNow(parseInt(message.created_timestamp), {addSuffix: true});

    T.get(`https://api.twitter.com/1.1/users/show.json?user_id=${messageObject.id}`, function (err, data, res) {
        
        messageObject.name = data.name;
        messageObject.picture = data.profile_image_url_https;

    });

    return messageObject;
}

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

function createTweet(tweet){

    let tweetObject = {};
    
    tweetObject.text = tweet.text;
    tweetObject.date = distanceInWordsToNow(tweet.created_at, {addSuffix: true});
    tweetObject.retweets = tweet.retweet_count;
    tweetObject.likes = tweet.favorite_count;

    return tweetObject;

}

//Programming can be lonely LOL
function createFriend(friend){

    let friendObject = {};

    friendObject.name = friend.name;
    friendObject.screenName = `@${friend.screen_name}`;
    friendObject.picture = friend.profile_image_url;

    return friendObject;
}

function createNewTweet(reBodyStatus){

    // Creates a new tweet  using the  req.body.status 
    // that is send when the user click post and then update the tweets array
    const tweetObject = {};
    
    // The tweet is new so the only actual data that it has is the message itself
	tweetObject.text = req.body.status;
	tweetObject.retweets = 0;
	tweetObject.likes = 0;
    tweetObject.date = distanceInWordsToNow(new Date(), {addSuffix: true});

    return tweetObject;

}

module.exports.createMessage = createMessage;
module.exports.createUser = createUser;
module.exports.createTweet = createTweet;
module.exports.createFriend = createFriend;
module.exports.createNewTweet = createNewTweet;