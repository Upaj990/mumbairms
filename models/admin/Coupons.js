var mongoose = require("mongoose");
var couponsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coupon_type: {
    type: String,
    required: true,
  },
  restaurant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"restaurant",
  },
  menu: {
    type: Array,
    ref:"menu"
  },
  code: {
    type: String,
    requird: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  discount_type: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  max_discount: {
    type: Number,
    required: true,
  },
  min_purchase: {
    type: Number,
    required: true,
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
var Coupons = (module.exports = mongoose.model("coupons", couponsSchema));
module.exports.get = function (callback, limit) {
    Coupons.find(callback).limit(limit);
};
