const express = require('express');
// const { check } = require('express-validator');

const musicsControllers = require('../controllers/musics-controllers');

const router = express.Router();

router.get('/', musicsControllers.getAllMusic);
router.get('/liked/:uid', musicsControllers.getMusicslikedByUser);
router.get('/liked/:uid/:lmid', musicsControllers.UpdateLikeMusicRankByUserId);
router.get('/recommended/:uid', musicsControllers.getMusicsRecommendedByUser);
router.get('/recommended/:uid/:rmid', musicsControllers.UpdateRecoMusicRankByUserId);

module.exports = router;