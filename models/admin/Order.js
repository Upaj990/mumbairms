var mongoose = require("mongoose");
var orderSchema = mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "table",
  },
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
  },
  order_type:{
    type: String,
    require: true,
  },
  food_items: {
    type: Array,
    require: true,
  },
  food_items_for_kot: {
    type: Array,
    require: true,
  },
  subtotal: {
    type: Number,
    require: true,
  },
  IGST_amount: {
    type: Number,
    require: true,
  },
  SGST_amount: {
    type: Number,
    require: true,
  },
  CGST_amount: {
    type: Number,
    require: true,
  },
  service_tax_amount: {
    type: Number,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  order_status: {
    type: Object,
    require: true,
  },
  order_history: {
    type: Array,
    require: true,
  },
  payment_status: {
    type: Object,
    require: true,
  },
  order_date_and_time: {
    type: Date,
    require: true,
  },
  instructions: {
    type: String,
    require: true,
  },
  invoice: {
    type: String,
    require: true,
  },
  bill: {
    type: String,
    require: true,
  },
  kot: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  update_on: {
    type: Date,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
var Order = (module.exports = mongoose.model("order", orderSchema));
module.exports.get = function (callback, limit) {
    Order.find(callback).limit(limit);
};
