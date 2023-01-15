var mongoose = require("mongoose");
var adminsSchema = mongoose.Schema({
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
    type: Number,
    require: true,
  },
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant"
  },
  password: {
    type: String,
    require: true,
  },
  identity_proof: {
    type: String,
    require: true,
  },
  admin_type: {
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
  update_on:{
    type: Date,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
var Admins = (module.exports = mongoose.model("admins", adminsSchema));
module.exports.get = function (callback, limit) {
  Admins.find(callback).limit(limit);
};
