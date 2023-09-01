const express = require('express');
const { check } = require('express-validator');

const musicsControllers = require('../controllers/musics-controllers');

const router = express.Router();

router.get('/', musicsControllers.getMusic);

module.exports = router;