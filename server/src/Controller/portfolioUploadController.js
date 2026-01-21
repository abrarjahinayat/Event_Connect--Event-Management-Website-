const express = require("express");
const multer = require("multer");
const path = require("path");

// Portfolio image upload configuration
const portfolioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/portfolio/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "portfolio-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const portfolioUpload = multer({
  storage: portfolioStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// @desc    Upload portfolio image
// @route   POST /api/v1/services/upload-portfolio-image
// @access  Private (Vendor only)
const uploadPortfolioImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageUrl = `${process.env.SERVER_URL}/uploads/portfolio/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Portfolio image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Portfolio image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message || error,
    });
  }
};

module.exports = {
  portfolioUpload,
  uploadPortfolioImageController,
};