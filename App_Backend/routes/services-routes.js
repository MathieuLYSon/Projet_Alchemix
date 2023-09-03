const express = require('express');
const servicesControllers = require('../controllers/services-controllers');

// const { check } = require('express-validator');

const router = express.Router();

router.get('/', servicesControllers.getAllServices);

router.get('/spotify', servicesControllers.getSpotifyService);

router.get('/spotify/login', servicesControllers.spotifyLogin);

router.get('/spotify/login/callback', servicesControllers.spotifyLogin);

module.exports = router;