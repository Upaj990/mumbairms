var mongoose = require("mongoose");
var restaurantSchema = mongoose.Schema({
  manager: {
    type: Array,
    require: true,
    ref:"admins"
  },
  restaurant_name:{
    type: String,
    required: true,
  },
  restaurant_contact_number: {
    type: String,
    required: true,
  },
  restaurant_email: {
    type: String,
    required: true,
  },
  food_type: {
    type: String,
    required: true,
  },
  restaurant_address: {
    type: Object,
    require: true,
  },
  latLong: {
    type: Object,
    require: true,
  },
  cuisines: {
    type: Array,
    require: true,
    ref:"cuisines"
  },
  GSTIN_number: {
    type: String,
    require: true,
  },
  GST_state: {
    type: String,
    require: true,
  },
  FSSAI_number: {
    type: String,
    require: true,
  },
  aadhar_copy: {
    type: Object,
    required: true,
  },
  pan_copy: {
    type: Object,
    required: true,
  },
  IGST_toggle: {
    type: String,
    require: true,
  },
  IGST_amount: {
    type: String,
    require: true,
  },
  IGST_type: {
    type: String,
    require: true,
  },
  SGST_toggle: {
    type: String,
    require: true,
  },
  SGST_amount: {
    type: String,
    require: true,
  },
  SGST_type: {
    type: String,
    require: true,
  },
  CGST_toggle: {
    type: String,
    require: true,
  },
  CGST_amount: {
    type: String,
    require: true,
  },
  CGST_type: {
    type: String,
    require: true,
  },
  service_tax_toggle: {
    type: String,
    require: true,
  },
  service_tax_amount: {
    type: String,
    require: true,
  },
  service_tax_type: {
    type: String,
    require: true,
  },
  restaurant_timings: {
    type: Object,
    require: true,
  },
  closed_on: {
    type: Array,
    require: true,
    ref: 'weeks'
  },
  bill_width: {
    type: String,
    required: true,
  },
  restaurant_logo: {
    type: Object,
    required: true,
  },
  restaurant_cover_photo: {
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
var Restaurant = (module.exports = mongoose.model("restaurant", restaurantSchema));
module.exports.get = function (callback, limit) {
    Restaurant.find(callback).limit(limit);
};
