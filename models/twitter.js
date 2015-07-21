var OAuth = require('oauth');
var TWITTER_URL = 'https://api.twitter.com/1.1/search/tweets.json?q=%23NowPlaying%20source%3Aspotify&count=5';
var tweets = [];

var init = function() {
  return new Promise(getData);
};

var getData = function(resolve, reject) {
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
        reject(error);
      } else {
        var formattedData = JSON.parse(data);
        resolve(formattedData.statuses);
      }
    }
  );
};

var findTweet = function(statuses) {
  tweets = statuses;
  return new Promise(findTweetPromise);
};

var findTweetPromise = function(resolve, reject) {
  if (!tweets || tweets.length < 0) {
    reject({
      statusCode: 404,
      msg: 'No tweets'
    });
    return;
  }

  var found = false;
  tweets.some(function(tweet) {
    if (tweet.entities && tweet.entities.urls) {
      tweet.entities.urls.some(function(url) {
        if (url.expanded_url.indexOf('http://spoti.fi/') === 0) {
          found = true;
          resolve({
            spotifyURL: url.expanded_url,
            tweet: tweet
          });
          return true;
        }
      });
    }
    return found;
  });

  if (!found) {
    reject({
      statusCode: 404,
      msg: 'No tweet found'
    });
  }
};

module.exports = {
  init: init,
  findTweet: findTweet
};
