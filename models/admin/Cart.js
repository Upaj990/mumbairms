var mongoose = require("mongoose");
var cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  food_items: {
    type: Array,
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
var Cart = (module.exports = mongoose.model("carts", cartSchema));
module.exports.get = function (callback, limit) {
    Cart.find(callback).limit(limit);
};
