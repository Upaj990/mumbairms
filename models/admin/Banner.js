var mongoose = require("mongoose");
var bannerSchema = mongoose.Schema({
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant",
    require: true,
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
var Banner = (module.exports = mongoose.model("banner", bannerSchema));
module.exports.get = function (callback, limit) {
    Banner.find(callback).limit(limit);
};
