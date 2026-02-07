const express = require('express');
const { signupController, verifyOtpControllers, loginControllers, getVendorByIdController } = require('../../../Controller/authController');
const router = express.Router();
const { uploadVendorSignup } = require("../../../utils/multer.img.upload");

// ✅ FIXED: Use uploadVendorSignup directly (it's already configured with the fields)
router.post('/signup', uploadVendorSignup, signupController);

router.post('/verify-otp', verifyOtpControllers);
router.post('/login', loginControllers);

// Get vendor by ID
router.get('/:id', getVendorByIdController);

module.exports = router;