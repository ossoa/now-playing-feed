var twitter = require('./models/twitter');
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
  function successMessage(data) {
    response.status(200).send(data);
  }
  function errorMessage(error) {
    response.status(error.statusCode).send('Sorry, something went wrong');
  }

  twitter.init()
    .then(successMessage, errorMessage);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
