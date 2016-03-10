var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
  title: {
    type: String,
    maxLength: 255,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    match: [/^\d{1,4}\.\d{2}/, 'Incorrect price value']
  },
  description: {
    type: String,
    maxLength: 1000,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
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

ItemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Items', ItemSchema);