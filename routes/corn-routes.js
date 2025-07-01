const express = require('express');
const router = express.Router();

const createRateLimiter = require('../middleware/rateLimiter');
const cornService = require('../repository/corn-repo');
const cornController = require('../controllers/corn-controller');

const cornPurchaseLimiter = createRateLimiter({
  getTimestamp: cornService.getLastPurchase,
  durationMs: 60 * 1000, // 1 minute
  message: 'Too Many Requests. Please wait {timeLeft} seconds.'
});

router.post('/buy-corn', cornPurchaseLimiter, cornController.purchaseCorn);

module.exports = router;