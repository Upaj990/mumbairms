var mongoose = require("mongoose");
var tableSchema = mongoose.Schema({
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant",
    required: true,
  },
  table_no: {
    type: String,
    required: true,
  },
  capacity_people: {
    type: Number,
    required: true,
  },
  qr_code: {
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
var Table = (module.exports = mongoose.model("table", tableSchema));
module.exports.get = function (callback, limit) {
    Table.find(callback).limit(limit);
};
