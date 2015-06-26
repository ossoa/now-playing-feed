var tweets = [];

var init = function(statuses) {
  tweets = statuses;
  return new Promise(getSpotifyUri);
};

var getSpotifyUri = function(resolve, reject) {
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

module.exports = {
  init: init
};
