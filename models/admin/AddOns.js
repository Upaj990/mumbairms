var mongoose = require("mongoose");
var addOnsSchema = mongoose.Schema({
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
var AddOns = (module.exports = mongoose.model("addOns", addOnsSchema));
module.exports.get = function (callback, limit) {
    AddOns.find(callback).limit(limit);
};
