const HttpError = require('../models/http-error');
const Service = require('../models/service');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/user');

const getAllServices = async (req, res, next) => {
  let services;
  try {
    services = await Service.find({});
  } catch (err) {
    const error = new HttpError(
      'Services Not Find.',
      500
    );
    return next(error);
  }
  res.json({ services: services.map(service => service.toObject({ getters: true })) });
};

const getSpotifyService = async (req, res, next) => {
  const spotify = "Spotify"
  let service;
  try {
    service = await Service.findOne({ name: spotify});

  } catch (err) {
    const error = new HttpError(
      'Services Not Find.',
      500
    );
    return next(error);
  }
  res.json({ service: service.toObject({ getters: true }) });
};

passport.use(
  new SpotifyStrategy(
    {
      clientID: '60d898c77e92460b8988529b4d3207c4',
      clientSecret: 'ea177528ae92405cbeb3a38dd259407b',
      callbackURL: 'http://localhost:3000/', // L'URI de redirection
      passReqToCallback: true,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      // Stockez ou mettez à jour les informations utilisateur dans MongoDB
      try {
        let user = await User.findOne({ email: "spotify@gmail.com" });

        if (!user) {
          user = new User({
            spotifyId: profile.id,
            displayName: profile.displayName,
            accessToken,
            refreshToken,
          });
          await user.save();
        } else {
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const spotifyLogin = async (req, res, next) => {
  console.log("Spotify Login Function");
  passport.authenticate('spotify', { scope: [
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-follow-read',
    'user-follow-modify'
  ] })
};

const spotifyLoginCallback = async (req, res, next) => {
  passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Redirigez l'utilisateur vers sa page de profil ou une autre page appropriée
    
    res.redirect('/64f359446728fc3b725389df/profil');
  }
};

exports.getAllServices = getAllServices;
exports.getSpotifyService = getSpotifyService;
exports.spotifyLogin = spotifyLogin;
exports.spotifyLoginCallback = spotifyLoginCallback;