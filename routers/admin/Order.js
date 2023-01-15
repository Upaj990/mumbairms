const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Order router",
  });
});

var OrderControllers = require("../../controllers/admin/Order");
router.route("/add_new_order")
  .post(OrderControllers.AddOrder);
router.route("/order_update")
  .post(OrderControllers.UpdateOrder);
router.route("/dashboard")
  .post(OrderControllers.DashboardDetials);
router.route("/order_track")
  .post(OrderControllers.OrderTrack);
router.route("/order_details")
  .post(OrderControllers.OrderDetails);
router.route("/list_of_order")
  .post(OrderControllers.ListOfOrder);
router.route("/restaurant_by_order_list")
  .post(OrderControllers.RestaurantByOrderList);
  router.route("/user_by_order_list")
  .post(OrderControllers.UsersByOrderList);
router.route("/delete_order")
  .post(OrderControllers.DeleteOrder);
router.route("/paginated-list-of-orders")
  .post(OrderControllers.paginatedListOfOrders);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;