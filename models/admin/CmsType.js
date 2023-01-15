var mongoose = require("mongoose");
var cmsTypeSchema = mongoose.Schema({
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
var CmsType = (module.exports = mongoose.model("cms_type", cmsTypeSchema));
module.exports.get = function (callback, limit) {
    CmsType.find(callback).limit(limit);
};
