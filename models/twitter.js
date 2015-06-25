var OAuth = require('oauth');
var TWITTER_URL = 'https://api.twitter.com/1.1/search/tweets.json?q=%23NowPlaying%20source%3Aspotify&count=5';

var initTweetFeed = function(callback) {
  var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      '1.0A',
      null,
      'HMAC-SHA1'
    );

  oauth.get(
    TWITTER_URL,
    process.env.TWITTER_ACCESS_TOKEN,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    function (error, data) {
      if (error) {
        callback(error, null);
      } else {
        var formattedData = JSON.parse(data);
        callback(null, formattedData);
      }
    }
  );
}

module.exports = {
  init: initTweetFeed
};
