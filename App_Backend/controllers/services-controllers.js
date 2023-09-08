const HttpError = require('../models/http-error');
const Service = require('../models/service');
const User = require('../models/user');
// const passport = require('passport');
// const SpotifyStrategy = require('passport-spotify').Strategy;

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

// Fonction pour initier l'authentification Spotify
const initiateSpotifyAuth = (req, res) => {
  console.log("########## ########## Login User to Spotify Service Routes ########## ##########");
  // Récupérez le token JWT de l'utilisateur à partir du middleware d'authentification
  const userJWTToken = req.params.uid;
  console.log("User JWT Token == ", userJWTToken);
  // Vous pouvez utiliser le token JWT pour identifier l'utilisateur
  // et générer l'URL d'authentification Spotify avec les paramètres appropriés

  // L'URL d'authentification Spotify
  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize';

  // Paramètres de la demande d'authentification Spotify
  const params = {
    client_id: '60d898c77e92460b8988529b4d3207c4',
    redirect_uri: 'http://localhost:8082/api/services/callback',
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative user-follow-read user-follow-modify', // Les autorisations dont vous avez besoin
    response_type: 200,
    state: true,
  };

  // Redirigez l'utilisateur vers l'URL d'authentification Spotify
  const redirectUrl = `${spotifyAuthUrl}?${new URLSearchParams(params)}`;
  res.redirect(redirectUrl);
  console.log("Redirection URL == ", redirectUrl);
  console.log("########## ########## ########## ##########");
};

// Fonction pour gérer la redirection après l'autorisation de Spotify
const handleSpotifyCallback = async (req, res) => {
  console.log("########## ########## Callback to Login User to Spotify Service Routes ########## ##########");
  // Récupérez le code d'autorisation de Spotify à partir de la requête
  const code = req.query.code;

  // Échangez le code d'autorisation contre un access token et un refresh token
  const spotifyTokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:8082/api/services/callback',
      client_id: '60d898c77e92460b8988529b4d3207c4',
      client_secret: 'ea177528ae92405cbeb3a38dd259407b',
    })
  );

  const [accessToken, refreshToken] = spotifyTokenResponse;
  console.log("Access Token == ", accessToken);
  console.log("Refresh Token == ", refreshToken);

  // Stockez l'access token et le refresh token dans la base de données de l'utilisateur
  // Vous devez implémenter cette logique en fonction de votre architecture

  // Effectuez des opérations supplémentaires comme enregistrer ces tokens dans la base de données de l'utilisateur

  // Redirigez l'utilisateur vers sa page de profil ou une autre page
  res.redirect('/');
  console.log("########## ########## ########## ##########");
};

// const spotifyLogin = async (req, res, next) => {
//   console.log("########## ########## Login User to Spotify Service Routes ########## ##########");
//   let user;
//   console.log("User ID == ", req.userData.userId);
//   try {
//     user = User.findById(req.userData.userId);
//     console.log("User qui veut se connecter à Spotify : ");
//     console.log(user);
//   } catch (err) {
//     const error = new HttpError(
//       'User introuvable.',
//       500
//     );
//     return next(error);
//   };
//   console.log("########## ########## ########## ##########");
// };

exports.getAllServices = getAllServices;
exports.getSpotifyService = getSpotifyService;
exports.initiateSpotifyAuth = initiateSpotifyAuth;
exports.handleSpotifyCallback = handleSpotifyCallback;
// exports.spotifyLogin = spotifyLogin;
// exports.spotifyLoginCallback = spotifyLoginCallback;