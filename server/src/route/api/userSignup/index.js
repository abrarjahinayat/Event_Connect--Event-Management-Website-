const express = require('express');
const { usersignupControllers, userloginControllers } = require('../../../Controller/userSignupControllers');

const router = express.Router();

// ✅ User Authentication Routes
router.post('/signup', usersignupControllers);
router.post('/login', userloginControllers);

// ✅ Optional: Add these routes later if needed
// router.post('/verify-email', verifyEmailController);
// router.post('/forgot-password', forgotPasswordController);
// router.post('/reset-password', resetPasswordController);
// router.get('/profile', authMiddleware, getUserProfileController);
// router.put('/profile', authMiddleware, updateUserProfileController);

module.exports = router;