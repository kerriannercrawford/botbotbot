const express = require('express');
const router = express.Router();
const mainController = require('../controller/mainController');

router.post('/', mainController.get, (req, res) => {
  res.status(200).json({test: 'hi'});
});

module.exports = router;
