const express = require("express");
const {
  askForBookingController,
  adminApproveBookingController,
  initiatePaymentController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
  getUserBookingsController,
  getSingleBookingController,
  cancelBookingController,
  verifyPaymentController,
  paymentIPNController,
  getVendorBookingsController,
  getVendorEarningsController,
} = require("../../../Controller/bookingControllers");

const router = express.Router();

// User Routes
router.post("/ask-for-booking", askForBookingController);
router.get("/my-bookings/:userId", getUserBookingsController);
router.get("/:bookingId", getSingleBookingController);
router.put("/cancel/:bookingId", cancelBookingController);

// Payment Routes
router.post("/initiate-payment/:bookingId", initiatePaymentController);
router.post("/payment-success/:tran_id", paymentSuccessController);
router.post("/payment-fail/:tran_id", paymentFailController);
router.post("/payment-cancel/:tran_id", paymentCancelController);

// Admin Routes
router.put("/admin-approve/:bookingId", adminApproveBookingController);
router.post("/verify-payment", verifyPaymentController);
router.post("/payment-ipn", paymentIPNController);

router.get("/vendor/:vendorId", getVendorBookingsController);
router.get("/vendor/:vendorId/earnings", getVendorEarningsController);

module.exports = router;