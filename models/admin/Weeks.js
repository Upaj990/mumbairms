var mongoose = require("mongoose");
var weeksSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title:{
    type: String,
    required: true,
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
var Weeks = (module.exports = mongoose.model("weeks", weeksSchema));
module.exports.get = function (callback, limit) {
    Weeks.find(callback).limit(limit);
};
