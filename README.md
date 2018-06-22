# TechdegreeJSProjectSeven
Twitter Interface

Use Twitter’s REST API to access user Twitter profile information and render it to a user. The page automatically authenticate
access to the user's Twitter profile.

Populates three columns on the page page:

5 most recent tweets.
5 most recent friends.
5 most recent direct messages.


To test the app:

Create a config.js in the root
Copy the below snippet and fill in your twitter app infomation
const keys = {
  consumer_key: '****',
  consumer_secret: '****',
  access_token: '****',
  access_token_secret: '****'
};

module.exports.keys = keys;

In the root directory(console command line), npm start
