var express = require('express');
var app = express();

var OAuth = require('oauth');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(request, response, next) {
  var TWITTER_URL = 'https://api.twitter.com/1.1/search/tweets.json?q=%23NowPlaying%20source%3Aspotify';

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
    function (e, data, res) {
      if (e) {
        response.status(e.statusCode).send('Sorry, something went wrong');
      } else {
        var formattedData = JSON.parse(data);
        response.status(200).send(formattedData);
      }
    }
  );
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
