var request = require('request');
var tweets = [];
var selectedTweet, spotiUrl, spotifyURI;

var findTweet = function(statuses) {
  tweets = statuses;
  return new Promise(findTweetPromise);
};

var errorMessage = function() {
  console.log('error');
}

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
          spotiUrl = url.expanded_url;
          selectedTweet = tweet;

          resolve(tweet);
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

var getSpotifyUri = function() {
  return new Promise(getSpotifyUriPromise);
}

var getSpotifyUriPromise = function(resolve, reject) {
  if (!spotiUrl) {
    reject({
      statusCode: 404,
      msg: 'No tweet found'
    });

    return;
  }

  request(spotiUrl, function(error, response, body) {
    if (error) {
      reject({
        statusCode: 404,
        msg: 'Something went wrong'
      });

      return;
    }
    var path = response.request.uri.path;
    spotifyURI = 'spotify' + path.split('/').join(':');
    resolve({
      spotifyUri: spotifyURI,
      tweet: selectedTweet
    });
  });
};

module.exports = {
  findTweet: findTweet,
  getSpotifyUri: getSpotifyUri
};
