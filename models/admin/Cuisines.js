var mongoose = require("mongoose");
var cuisinesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
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
var Cuisines = (module.exports = mongoose.model("cuisines", cuisinesSchema));
module.exports.get = function (callback, limit) {
    Cuisines.find(callback).limit(limit);
};
