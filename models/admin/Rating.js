var mongoose = require("mongoose");
var ratingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
  },
  rating_value: {
    type: Number,
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
var Rating = (module.exports = mongoose.model("ratings", ratingSchema));
module.exports.get = function (callback, limit) {
    Rating.find(callback).limit(limit);
};
