const express = require('express');
const router = express.Router();
const auth = require('./auth');
const services = require('./vendorServices');
const userSignup = require('./userSignup');
const booking = require('./booking');
const admin = require('./admin');

router.use('/admin', admin );

router.use('/booking', booking  );

router.use('/user', userSignup);

router.use('/auth', auth);
router.use('/services', services);
module.exports = router;