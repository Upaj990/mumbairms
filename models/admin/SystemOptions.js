var mongoose = require("mongoose");
var systemOptionsSchema = mongoose.Schema({
  facebook: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    require: true,
  },
  twitter: {
    type: String,
    require: true,
  },
  restaurant_range: {
    type: Number,
    require: true,
  },
  table_range: {
    type: Number,
    require: true,
  },
  active_inactive: {
    type: Boolean,
    require: true,
  },
  status: {
    type: Boolean,
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
var SystemOptions = (module.exports = mongoose.model("system_options", systemOptionsSchema));
module.exports.get = function (callback, limit) {
    SystemOptions.find(callback).limit(limit);
};
