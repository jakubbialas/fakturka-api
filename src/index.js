var http = require('http');
var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var auth = require('./auth/auth');
var api = require('./api');

var passport = require('passport');
require('./auth/passport')(passport);

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

app.use('/auth', auth);
app.use(passport.authenticate("jwt", { session: false }));

app.use('/api', api);

var server = http.createServer(app);
var port = 8080;
server.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});
