var mongoose = require("mongoose");
var stockTypeSchema = mongoose.Schema({
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
var StockType = (module.exports = mongoose.model("stockType", stockTypeSchema));
module.exports.get = function (callback, limit) {
  StockType.find(callback).limit(limit);
};