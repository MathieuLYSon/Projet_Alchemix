const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Music = require('../models/music');

const getMusic = async (req, res, next) => {
  console.log("########## ########## Get Musics Routes ########## ##########");
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

exports.getMusic = getMusic;