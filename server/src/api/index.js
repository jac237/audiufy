const express = require('express');

const spotify = require('./spotify');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/spotify', spotify);

module.exports = router;
