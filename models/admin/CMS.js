var mongoose = require("mongoose");
var cmsSchema = mongoose.Schema({
  cms_type: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"cms_type"
  },
  content: {
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
var CMS = (module.exports = mongoose.model("cms", cmsSchema));
module.exports.get = function (callback, limit) {
    CMS.find(callback).limit(limit);
};