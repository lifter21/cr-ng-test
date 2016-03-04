'use strict'

var express = require('express');

var app = express();

var port = 4000;
app.listen(port, function () {
    console.log('Now server is runnign on %s ', port);
  }
);