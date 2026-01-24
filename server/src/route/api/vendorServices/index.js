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
const upload = require("../../../utils/multer.img.upload");

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

// 🎯 NEW: Portfolio image upload endpoint
router.post(
  "/upload-portfolio-image",
  portfolioUpload.single("portfolioImage"),
  uploadPortfolioImageController
);

// Protected routes (Vendor only)
router.post(
  "/addservices",
  upload.array("image", 10),
  addvendorServicesControllers
);

router.put(
  "/:id",
  upload.array("image", 10),
  updateServiceController
);

router.delete("/:id", deleteServiceController);

// Review routes
router.post("/:id/review", addReviewController);

// Booking routes
router.post("/:id/book", createBookingController);



module.exports = router;