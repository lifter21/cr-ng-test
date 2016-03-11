'use strict';
// express/app basic configuration
var app = require('./app.core');

var port = app.config.get('app:port');

// send SPA (html5mode: on) index.html on every request
//app.use('/', function (req, res, next) {
//  res.sendFile(__dirname + '/app.public/index.html');
//});

// handle errors
app.use(function (err, req, res, next) {
  console.error('Error on ', err.stack, ' URL: ', err);
  next(err)
});

// log custom requests
app.use(function (req, res, next) {
  console.log('-> ', req.url);
  next();
});

// handle unknown routes and XHR
app.use(function (req, res) {
  if (req.xhr) {
    return res.status(404).sendFile(__dirname + '/app.public/404.html');
  }
  //return res.sendStatus(404);
  return res.status(404).sendFile(__dirname + '/app.public/404.html');
});

app.listen(port, function () {
  console.log('Now server is running on %s port.', port);
});
