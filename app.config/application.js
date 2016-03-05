'use strict';

var App = require('plus.application');

var application = new App({
  dir: __dirname,
  env: process.env.NODE_ENV || 'development'
});

module.exports = application;