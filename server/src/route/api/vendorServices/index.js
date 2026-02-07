const express = require("express");
const {
  addvendorServicesControllers,
  getallvendorServicesControllers,
  getSingleServiceController,
  updateServiceController,
  deleteServiceController,
  addReviewController,
  getServicesByVendorController,
  getServicesByCategoryController,
  createBookingController,
  getAllReviewsController,
  getServiceReviewsController,
} = require("../../../Controller/vendorServicesControllers");
const { 
  portfolioUpload, 
  uploadPortfolioImageController 
} = require("../../../Controller/portfolioUploadController");

// 🎯 FIXED: Import uploadVendorService (already configured with fields)
const { uploadVendorService, upload } = require("../../../utils/multer.img.upload");

const router = express.Router();

// Public routes
router.get("/allservices", getallvendorServicesControllers);
router.get("/category/:category", getServicesByCategoryController);
router.get("/vendor/:vendorId", getServicesByVendorController);
// Add these routes
router.get("/reviews/all", getAllReviewsController);
router.get("/:id/reviews", getServiceReviewsController);
router.post("/:id/review", addReviewController);
router.get("/:identifier", getSingleServiceController);

// Portfolio image upload endpoint
router.post(
  "/upload-portfolio-image",
  portfolioUpload.single("portfolioImage"),
  uploadPortfolioImageController
);

// Protected routes (Vendor only)
// 🎯 FIXED: Use ONLY uploadVendorService (remove upload.array)
router.post(
  "/addservices",
  uploadVendorService,  // ✅ This already handles image + profilePicture
  addvendorServicesControllers
);

// 🎯 FIXED: For update, use upload.array (no profile picture needed for updates)
router.put(
  "/:id",
  upload.array("image", 10),
  updateServiceController
);

router.delete("/:id", deleteServiceController);

// Review routes (duplicate removed)
// router.post("/:id/review", addReviewController); // Already defined above

// Booking routes
router.post("/:id/book", createBookingController);

module.exports = router;