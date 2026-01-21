const express = require('express');
const router = express.Router();
const api = require('./api');

router.use(`${process.env.BASE_URL}`, api);

console.log("route working");

module.exports = router;