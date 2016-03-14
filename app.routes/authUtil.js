'use strict';

module.exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
};

module.exports.isAdmin = function (req, res, next) {
  if (!req.user.isAdmin()) {
    return res.status(403).json({
      error: 'Permission denied'
    });
  }
  next();
};

module.exports.hasAccessByGroup = function (group) {
  return function (req, res, next) {
    if (!req.user.hasGroup(group)) {
      return res.status(403).json({
        error: 'Permission denied'
      });
    }

    next();
  };
};