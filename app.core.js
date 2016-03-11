var express = require('express'),
  app = express();

require('./app.config')(app);

//prevent cache in ie
app.use(function noCache(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  next();
});

// app routes
require('./app.routes')(app);

// send public scripts and assets
app.use(express.static(__dirname + '/app.public'));

module.exports = app;