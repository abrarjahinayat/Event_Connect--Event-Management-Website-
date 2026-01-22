const express = require('express');
const { signupController, verifyOtpControllers, loginControllers } = require('../../../Controller/authController');
const router = express.Router();
const upload = require("../../../utils/multer.img.upload");

// ✅ Updated: Handle multiple file uploads
// Fields: image (optional), tradeLicense (required), nidDocument (required)
router.post('/signup', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tradeLicense', maxCount: 1 },
    { name: 'nidDocument', maxCount: 1 }
]), signupController);

router.post('/verify-otp', verifyOtpControllers);
router.post('/login', loginControllers);


module.exports = router;