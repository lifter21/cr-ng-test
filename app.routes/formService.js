module.exports.isValidForm = function (req, res, next) {
  if (!req.form.isValid) {
    return res.status(400).json(req.form.getErrors())
  }

  next();
};