var OAuth = require('oauth');
var request = require('request');

var SPOTIFY_WEB_API_URL = 'https://api.spotify.com/v1/';
var SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/';
var tweets = [];
var selectedTweet, spotifyURL, spotifyPath;

var getSpotifyUri = function(data) {
  spotifyURL = data.spotifyURL;
  selectedTweet = data.tweet;

  return new Promise(getSpotifyUriPromise);
}

var getSpotifyUriPromise = function(resolve, reject) {
  if (!spotifyURL) {
    reject({ statusCode: 404, msg: 'No tweet found' });
    return;
  }

  request(spotifyURL, function(error, response, body) {
    if (error) {
      reject({ statusCode: 404, msg: 'Something went wrong' });
      return;
    }
    spotifyPath = response.request.uri.path;
    resolve(response.request.uri.path);
  });
};

var getSpotifyData = function(path) {
  spotifyPath = path;
  return getSpotifyAccessToken().then(getSpotifyEntityData, function(error) {
    console.log('ERROR', error);
  });
};

var getSpotifyAccessToken = function() {
  return new Promise(function(resolve, reject) {
    var OAuth2 = OAuth.OAuth2;

    var oauth2 = new OAuth2(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET,
      SPOTIFY_ACCOUNTS_URL,
      null,
      'api/token',
      null);

    var callback = function (error, accessToken, refreshToken, results) {
      if (error) {
        reject({ statusCode: 404, msg: 'Wrong Spotify credentials' });
        return;
      }

      resolve(accessToken);
    };

    oauth2.getOAuthAccessToken('', { 'grant_type':'client_credentials' }, callback);
  });
};

var getSpotifyEntityData = function(accessToken) {
  return new Promise(function(resolve, reject) {
    var path = generateUrlPath();
    if (!path) return;

    var requestOptions = {
      url: path,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };

    request(requestOptions, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        resolve({
          type: spotifyPath,
          spotify: data,
          tweet: selectedTweet
        });
      } else {
        reject({ statusCode: 404, msg: 'No Spotify object found' });
      }
    });
  });
};

var generateUrlPath = function() {
  if (!spotifyPath) return;

  var parts = spotifyPath.split('/');

  if (parts.length < 2) return;

  var type;
  if (parts[1] === 'track' ) {
    url = 'tracks/' + parts[2];
  } else if (parts[1] === 'album' ) {
    url = 'albums/' + parts[2] + '/tracks';
  } else if (parts[1] === 'artist' ) {
    url = 'artists/' + parts[2] + '/top-tracks?country=US';
  } else if (parts[1] === 'user' && parts[3] === 'playlist') {
    url = 'users/' + parts[2] + '/playlists/' + parts[4];
  } else {
    return;
  }

  return SPOTIFY_WEB_API_URL + url;
}

module.exports = {
  getSpotifyUri: getSpotifyUri,
  getSpotifyData: getSpotifyData
};
