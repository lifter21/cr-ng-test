//var crypto = require('crypto');
//var mongoose = require('mongoose');
//
//var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//
//// var validateEmail = function(email) {
////     return emailRegex.test(email)
//// };
//
//var Schema = mongoose.Schema;
//
//var UserSchema = new Schema({
//  // possible fields: [rating, birthday, avatar, etc]
//  firstname: {
//    type: String,
//    required: true
//  },
//  lastname: {
//    type: String,
//    required: true
//  },
//  email: {
//    type: String,
//    required: true,
//    // validate: [validateEmail, 'Please fill a valid email address'],
//    match: [emailRegex, 'Please fill a valid email address'],
//    index: 1,
//    lowercase: true
//  },
//  role: {
//    type: Array,
//    required: true,
//    default: ['trainee']
//  },
//  local: {
//    name: {
//      type: String,
//      index: 1,
//      required: true,
//      lowercase: true
//    },
//    passwordHash: String,
//    passwordSalt: String
//  },
//  createdAt: {
//    type: Date,
//    default: Date.now
//  },
//  updatedAt: {
//    type: Date,
//    default: Date.now
//  }
//});
//
//UserSchema.set("toJSON", {
//  getters: true,
//  virtuals: true
//});
//
//function hash(data) {
//  return crypto
//    .createHash('sha256')
//    .update(data)
//    .digest('hex');
//};
//
//UserSchema.methods = {
//  validPassword: function(password) {
//    return this.local.passwordHash === hash(this.local.passwordSalt + password);
//  },
//  setPassword: function(password) {
//    var salt = "some data, hash or other string" + new Date() + Math.random();
//    this.local.passwordSalt = hash(salt);
//    this.local.passwordHash = hash(this.local.passwordSalt + password);
//  }
//};
//
//UserSchema.virtual('local.password').set(function(password) {
//  this.setPassword(password);
//});
//
//UserSchema.virtual('username').get(function() {
//  return [this.firstname, this.lastname].join(' ');
//});
//
//// module.exports = mongoose.model('Users', UserSchema);
//module.exports = mongoose.model('User', UserSchema);