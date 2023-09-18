const express = require('express');

const servicesControllers = require('../controllers/services-controllers');
const servicesSpotifyControllers = require('../controllers/service-spotify-controllers');

const router = express.Router();

// Root Services Routes :
router.get('/', servicesControllers.getAllServices);
router.get('/spotify', servicesControllers.getSpotifyService);

// Spotify Service Routes :
router.get('/spotify/auth', servicesSpotifyControllers.initiateSpotifyAuth);
router.get('/spotify/callback', servicesSpotifyControllers.handleSpotifyCallback);
router.get('/spotify/authenticated', servicesSpotifyControllers.checkSpotifyAuthentication);
router.get('/spotify/refresh_token', servicesSpotifyControllers.refreshSpotifyAccessToken);

// Deezer Service Routes :
// Napster Service Routes :
module.exports = router;