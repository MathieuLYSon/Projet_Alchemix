const { validationResult, header } = require('express-validator');

const HttpError = require('../models/http-error');
const Music = require('../models/music');
const MusicLiked = require('../models/music-liked');
const MusicRecommended = require('../models/music-recommended');

const getAllMusic = async (req, res, next) => {
  console.log("\n########## ########## Get Musics Route ########## ##########");
    let existingmusics;
    try {
      existingmusics = await Music.find({});
    } catch (err) {
      const error = new HttpError(
        'Fetching music failed, please try again later.',
        500
      );
      return next(error);
    }

    if (existingmusics) {
      res.json({ existingmusics: existingmusics.map(music => music.toObject({ getters: true })) });
    } else {
        const error = new HttpError(
            'Music Not Find.',
            422
          );
        return next(error);
    }
    console.log("########## ########## ########## ##########");
};

const getMusicslikedByUser = async (req, res, next) => {
  console.log("\n########## ########## Get Musics Liked by User Route ########## ##########");
  userId = req.params.uid;
  console.log("User ID == ", userId);

  // Trouver les musiques de l'utilisateur dans la BDD recommended_musics :
  let userMusicsLiked;
    try {
      userMusicsLiked = await MusicLiked.find({ user_id: userId });
    } catch (err) {
      const error = new HttpError(
        'Fetching music failed, please try again later.',
        500
      );
      console.log()
      return next(error);
    }

    if (userMusicsLiked) {
      res.json({ userMusicsLiked: userMusicsLiked.map(music => music.toObject({ getters: true })) });
    } else {
        const error = new HttpError(
            'Liked Musics Not Find.',
            422
          );
        return next(error);
    }
  console.log("########## ########## END Route ########## ##########");
};

const getMusicsRecommendedByUser = async (req, res, next) => {
  console.log("\n########## ########## Get Musics Recommanded by User Route ########## ##########");
  userId = req.params.uid;
  console.log("User ID == ", userId);

  let userMusicsRecommended;
    try {
      userMusicsRecommended = await MusicRecommended.find({ user_id: userId });
    } catch (err) {
      const error = new HttpError(
        'Fetching music failed, please try again later.',
        500
      );
      return next(error);
    }

    if (userMusicsRecommended) {
      res.json({ userMusicsRecommended: userMusicsRecommended.map(music => music.toObject({ getters: true })) });
      console.log("User Recommended Musics == ", userMusicsRecommended);
    } else {
        const error = new HttpError(
            'Recommended Musics Not Find.',
            422
          );
        return next(error);
    }
  console.log("########## ########## END Route ########## ##########");
};

const UpdateRecoMusicRankByUserId = async (req, res, next) => {
  console.log("\n########## ########## Update Recommanded Musics Rank by User ID Route ########## ##########");
  let userId = req.params.uid;
  let musicId = req.params.rmid;
  let newNote = req.query["note"];
  console.log("Params == ", req.params);
  console.log("Test == ", newNote);
  console.log("Header == ", req.query);

  let music;
  try {
    music = await MusicRecommended.findById(musicId);
  } catch (err) {
    const error = new HttpError(
      'Fetching music failed, please try again later.',
      500
    );
    return next(error);
  }
  music.note = newNote;
  await music.save()
  console.log("Music == ", music);
  console.log("User ID == ", userId);
  console.log("User ID == ", musicId);
  res.json("Salut");
  console.log("########## ########## ########## ##########");
}

const UpdateLikeMusicRankByUserId = async (req, res, next) => {
  console.log("\n########## ########## Update Liked Musics Rank by User ID Route ########## ##########");
  let userId = req.params.uid;
  let musicId = req.params.lmid;
  let newNote = req.query["note"];
  console.log("Params == ", req.params);
  console.log("Test == ", newNote);
  console.log("Header == ", req.query);

  let music;
  try {
    music = await MusicLiked.findById(musicId);
  } catch (err) {
    const error = new HttpError(
      'Fetching music failed, please try again later.',
      500
    );
    return next(error);
  }
  music.note = newNote;
  await music.save()
  console.log("Music == ", music);
  console.log("User ID == ", userId);
  console.log("User ID == ", musicId);
  res.json("Salut");
  console.log("########## ########## ########## ##########");
}

exports.getAllMusic = getAllMusic;
exports.getMusicslikedByUser = getMusicslikedByUser;
exports.getMusicsRecommendedByUser = getMusicsRecommendedByUser;
exports.UpdateRecoMusicRankByUserId = UpdateRecoMusicRankByUserId;
exports.UpdateLikeMusicRankByUserId = UpdateLikeMusicRankByUserId;