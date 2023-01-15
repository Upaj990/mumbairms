var mongoose = require('mongoose');
var usersSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  profile: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  date_of_birth: {
    type: String,
    require: true,
  },
  preference: {
    type: String,
    require: true,
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'restaurant',
    },
  ],
  latLong: {
    type: Object,
    require: true,
  },
  address: {
    type: Object,
    require: true,
  },
  device_uid: {
    type: String,
    require: true,
  },
  os: {
    type: String,
    require: true,
  },
  fcm_token: {
    type: String,
    require: true,
  },
  login_source: {
    type: String,
    require: true,
  },
  active_inactive: {
    type: Boolean,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
var Users = (module.exports = mongoose.model('users', usersSchema));
module.exports.get = function (callback, limit) {
  Users.find(callback).limit(limit);
};
