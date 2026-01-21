const express = require("express");
const {
  adminLoginController,
  createAdminController,
  
  // Vendor Management
  getAllVendorsController,
  getVendorDetailsController,        // 🆕 NEW
  verifyVendorController,
  deleteVendorController,            // 🆕 NEW
  deleteVendorServiceController,     // 🆕 NEW
  rateVendorController,
  
  // User Management
  getAllUsersController,
  getUserDetailsController,          // 🆕 NEW
  deleteUserController,              // 🆕 NEW
  
  // Booking Management
  getAllBookingsController,
  getPendingBookingsController,
  approveRejectBookingController,    // 🆕 NEW (moved from bookingControllers)
  
  // Analytics
  getAnalyticsController,
} = require("../../../Controller/adminControllers");

const router = express.Router();

// ====================================
// ADMIN AUTHENTICATION
// ====================================
router.post("/login", adminLoginController);
router.post("/create", createAdminController); // Super admin only

// ====================================
// VENDOR MANAGEMENT
// ====================================
router.get("/vendors", getAllVendorsController);
router.get("/vendors/:id", getVendorDetailsController);                    // 🆕 NEW - Get vendor details
router.put("/vendors/:vendorId/verify", verifyVendorController);
router.put("/vendors/:vendorId/rate", rateVendorController);
router.delete("/vendors/:id", deleteVendorController);                     // 🆕 NEW - Delete vendor
router.delete("/vendors/:vendorId/services/:serviceId", deleteVendorServiceController); // 🆕 NEW - Delete service

// ====================================
// USER MANAGEMENT
// ====================================
router.get("/users", getAllUsersController);
router.get("/users/:id", getUserDetailsController);                        // 🆕 NEW - Get user details
router.delete("/users/:id", deleteUserController);                         // 🆕 NEW - Delete user

// ====================================
// BOOKING MANAGEMENT
// ====================================
router.get("/bookings", getAllBookingsController);
router.get("/bookings/pending", getPendingBookingsController);
router.put("/bookings/:bookingId/approve", approveRejectBookingController);      // 🆕 UPDATED - Now from adminControllers

// ====================================
// ANALYTICS
// ====================================
router.get("/analytics", getAnalyticsController);

module.exports = router;