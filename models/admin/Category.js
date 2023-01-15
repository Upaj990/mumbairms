var mongoose = require("mongoose");
var categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
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
var Category = (module.exports = mongoose.model("category", categorySchema));
module.exports.get = function (callback, limit) {
    Category.find(callback).limit(limit);
};
