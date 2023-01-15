var mongoose = require("mongoose");
var inventorySchema = mongoose.Schema({
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant"
  },
  stockType: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"stockType"
  },
  added_date_and_time: {
    type: Date,
    require: true,
  },
  item_name: {
    type: Object,
    require: true,
  },
  food_type: {
    type: String,
    require: true,
  },
  total_amount:{
    type: Number,
    require: true,
  },
  current_amount:{
    type: Number,
    require: true,
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
var Inventory = (module.exports = mongoose.model("inventory", inventorySchema));
module.exports.get = function (callback, limit) {
    Inventory.find(callback).limit(limit);
};
