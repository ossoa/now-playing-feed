var request = require('request');
var tweets = [];
var selectedTweet, spotifyURL;

var getSpotifyUri = function(data) {
  spotifyURL = data.spotifyURI;
  selectedTweet = data.tweet;

  return new Promise(getSpotifyUriPromise);
}

var getSpotifyUriPromise = function(resolve, reject) {
  if (!spotifyURL) {
    reject({
      statusCode: 404,
      msg: 'No tweet found'
    });

    return;
  }

  request(spotifyURL, function(error, response, body) {
    if (error) {
      reject({
        statusCode: 404,
        msg: 'Something went wrong'
      });

      return;
    }
    var path = response.request.uri.path;
    var spotifyURI = 'spotify' + path.split('/').join(':');
    resolve({
      spotifyUri: spotifyURI,
      tweet: selectedTweet
    });
  });
};

module.exports = {
  getSpotifyUri: getSpotifyUri
};
