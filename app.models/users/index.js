var crypto = require('crypto');
var mongoose = require('mongoose');

var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phoneRegex = /^\+(380)\d{9}/;

// var validateEmail = function(email) {
//     return emailRegex.test(email)
// };

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // possible fields: [rating, birthday, avatar, etc]
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: true,
    // validate: [validateEmail, 'Please fill a valid email address'],
    match: [emailRegex, 'Please fill a valid email address'],
    index: 1,
    lowercase: true
  },
  phone: {
    type: String,
    match: [phoneRegex, 'Please, fill a valid phone number']
  },
  username: {
    type: String,
    index: 1,
    required: true,
    lowercase: true
  },
  local: {
    passwordHash: String,
    passwordSalt: String
  },
  facebook: {
    id: String,
    email: String,
    token: String
  },
  google: {
    id: String,
    email: String,
    token: String
  },
  system: {
    isAdmin: {type: Boolean, default: false},
    groups: {
      type: [String],
      default: ['user'],
      enum: ['user', 'moderator', 'seo', 'etc']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.set("toJSON", {
  getters: true,
  virtuals: true
});

function hash(data) {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
};

UserSchema.methods = {
  validPassword: function (password) {
    return this.local.passwordHash === hash(this.local.passwordSalt + password);
  },
  setPassword: function (password) {
    var salt = "some data, hash or other string" + new Date() + Math.random();
    this.local.passwordSalt = hash(salt);
    this.local.passwordHash = hash(this.local.passwordSalt + password);
  }
};
UserSchema.methods.isAdmin = function () {
  return this.system && this.system.isAdmin;
};

UserSchema.methods.addGroup = function (group) {
  this.system = this.system || {};
  this.system.groups = this.system.groups || [];

  this.system.groups.push(group);
  this.system.groups = _.uniq(this.system.groups);
};

UserSchema.methods.hasGroup = function (group) {
  var self = this;

  if (_.isString(group)) {
    group = [group];
  }

  if (self.system) {
    var inGroup = _.find(group, function (item) {
      return _.find(self.system.groups, function (uGroup) {
        return uGroup === item;
      });
    });

    if (inGroup || self.isAdmin()) {
      return true;
    }
  }

  return false;
};

UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

UserSchema.virtual('local.password').set(function (password) {
  this.setPassword(password);
});

UserSchema.virtual('socials.isConnectedFB').get(function () {
  return this.facebook && !!this.facebook.id;
});

UserSchema.virtual('socials.isConnectedGoogle').get(function () {
  return this.google && !!this.google.id;
});

UserSchema.virtual('fullName').get(function () {
  return [this.firstname, this.lastname].join(' ');
});

// module.exports = mongoose.model('Users', UserSchema);
module.exports = mongoose.model('Users', UserSchema);