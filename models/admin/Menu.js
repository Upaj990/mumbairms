var mongoose = require("mongoose");
var menuSchema = mongoose.Schema({
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant"
  },
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"category"
  },
  food_type: {
    type: String,
    require: true,
  },
  menu_name: {
    type: Object,
    require: true,
  },
  SKU: {
    type: Object,
    require: true,
  },
  addons_categories: {
    type: Array,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  taxes: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    require: true,
  },
  image: {
    type: Object,
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
var Menu = (module.exports = mongoose.model("menu", menuSchema));
module.exports.get = function (callback, limit) {
    Menu.find(callback).limit(limit);
};
