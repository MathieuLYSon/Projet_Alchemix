const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const MusicLiked = require('../models/music-liked');
const UserPlayedHistory = require('../models/user-played-history');
const { json } = require('body-parser');

const initiateSpotifyAuth = (req, res, next) => {
  console.log("\n########## ########## Login User to Spotify Service Route ########## ##########");
  
  const userJWTToken = req.headers.authorization; // Récup du userJWTToken dans le header de la requête

  // Vérification du token utilisateur :
  let userData;
  try {
    userData = jwt.verify(userJWTToken, 'supersecret_dont_share');
    console.log(`Le User "${userData.name}" a bien été authentifié !`);
  } catch (err) {
    const error = new HttpError(
      `Token "${userJWTToken}" inconnu. Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // L'URL d'authentification Spotify :
  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize';

  // Paramètres de la demande d'authentification Spotify :
  const params = {
    client_id: '60d898c77e92460b8988529b4d3207c4',
    redirect_uri: 'http://localhost:8082/api/services/spotify/callback',
    scope: 'user-read-private user-read-email user-library-read playlist-read-private playlist-read-collaborative user-follow-read user-follow-modify user-read-recently-played', // Scopes de l'utilisateur
    response_type: 'code',
    state: userJWTToken,
  };

  // URL d'authentification Spotify entière :
  const redirectUrl = `${spotifyAuthUrl}?${new URLSearchParams(params)}`;

  res.json({ redirectUrl }); // Renvoie de l'URL d'authentification Spotify au Frontend
  console.log("########## ########## END Route ########## ##########");
};


const handleSpotifyCallback = async (req, res, next) => {
  console.log("\n########## ########## Callback to Login User to Spotify Service Route ########## ##########");
  
  const code = req.query.code; // Récup du code d'autorisation Spotify dans la requête
  const userJWTToken = req.query.state; // Récup du state du callback renvoyé par Spotify pour identifier l'user
  
  // Vérification du token utilisateur :
  let userData;
  try {
    userData = jwt.verify(userJWTToken, 'supersecret_dont_share');
    console.log(`${userData.name}" a bien été authentifié !`);
  } catch (err) {
    const error = new HttpError(
      `Token "${userJWTToken}" inconnu. Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Échange du code d'autorisation contre un access token :
  const spotifyTokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:8082/api/services/spotify/callback',
      client_id: '60d898c77e92460b8988529b4d3207c4',
      client_secret: 'ea177528ae92405cbeb3a38dd259407b',
    }), {
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from('60d898c77e92460b8988529b4d3207c4' + ':' + 'ea177528ae92405cbeb3a38dd259407b').toString('base64')),
      }
    }
  );
  const accessToken = spotifyTokenResponse.data.access_token; // récup du access_token
  const refreshToken = spotifyTokenResponse.data.refresh_token; // récup du refresh_token
  console.log("L'Access_Token et le Refresh_Token Spotify ont bien été récupéré !");

  // Trouver l'user dans la BDD avec l'userId :
  let authUser;
  try {
    authUser = await User.findById(userData.userId);
    console.log(`Le User "${authUser._id}" a bien été trouvé dans la BDD !`);
  } catch (err) {
    const error = new HttpError(
      `Utilisateur "${userData.userId}" introuvable dans la BDD... Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }
  
  // Enregistrer accesss_token & refresh_token dans le doc User de la BDD :
  try {
    authUser.accessToken = accessToken;
    authUser.refreshToken = refreshToken;
    await authUser.save();
    console.log(`Les données de l'User "${userData.name}" ont bien été mise à jour dans la BDD !`);
  } catch (err) {
    const error = new HttpError(
      `Un problème s'est produit, impossible de mettre à jour l'utilisateur "${userData.userId}".`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // 1er call pour get le nb total de music liké par l'User :
  const spotifyLikedMusicsFirstResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
    params: { limit: 50, offset: 0 },
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + authUser.accessToken,
      'Content-Type': 'application/json',
    },
  })
  let trackList = [];
  let nbTotalTracks = spotifyLikedMusicsFirstResponse.data.total; // Get du nb total de music liké
  let nbTotalPages = Math.round(nbTotalTracks / 50); // Calcule du nb de pages
  trackList.push(spotifyLikedMusicsFirstResponse.data.items); // Get des musics de la 1ere page
  console.log("L'User possède ", nbTotalTracks, " musiques likés sur Spotify.");
  console.log("Il y a donc ", nbTotalPages, " pages de musiques.");

  // Get des musics des autres pages :
  if (nbTotalPages > 0) {
    nbTotalTracks -= 50;
    let i = 0;
    let limit = 50;
    let offset = 50;
    while (i < nbTotalPages - 1) {
      const spotifyLikedMusicsResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
        params: { limit: limit, offset: offset },
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + authUser.accessToken,
          'Content-Type': 'application/json',
        },
      })
      trackList.push(spotifyLikedMusicsResponse.data.items);
      offset += 50;
      nbTotalTracks -= 50;
      i += 1;
    }
  }
  console.log("Les musiques ont bien été récupéré !");

  // Parcourir la TrackList et rassembler ca avec les données des features dans mergeTrackList :
  for (i in trackList) {
    for (y in trackList[i]) {
      console.log("tracklist == ", trackList[i][y]);
      let trackId = trackList[i][y].track.id;
      let trackArtists = [];
      for (x in trackList[i][y].track.artists) {
        trackArtists.push(trackList[i][y].track.artists[x].name);
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Attendre 0.5s
      const spotifyMusicFeaturesResponse = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + authUser.accessToken,
          'Content-Type': 'application/json',
        },
      })
      const createdMusic = new MusicLiked({
        added_at: trackList[i][y].added_at,
        track_id: trackId,
        titre: trackList[i][y].track.name,
        artists: trackArtists,
        album_name: trackList[i][y].track.album.name,
        album_image: trackList[i][y].track.album.images[1].url.substring(24),
        year: trackList[i][y].track.album.release_date.substring(0, 4),
        popularity: trackList[i][y].track.popularity,
        danceability: spotifyMusicFeaturesResponse.data.danceability,
        energy: spotifyMusicFeaturesResponse.data.energy,
        key: spotifyMusicFeaturesResponse.data.key,
        duration_ms: trackList[i][y].track.duration_ms,
        time_signature: spotifyMusicFeaturesResponse.data.time_signature,
        mode: spotifyMusicFeaturesResponse.data.mode,
        loudness: spotifyMusicFeaturesResponse.data.loudness,
        speechiness: spotifyMusicFeaturesResponse.data.speechiness,
        acousticness: spotifyMusicFeaturesResponse.data.acousticness,
        instrumentalness: spotifyMusicFeaturesResponse.data.instrumentalness,
        valence: spotifyMusicFeaturesResponse.data.valence,
        tempo: spotifyMusicFeaturesResponse.data.tempo,
        liveness: spotifyMusicFeaturesResponse.data.liveness,
        liked: true,
        user_id: userData.userId,
        note: 0,
      });
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdMusic.save({ session: sess });
      authUser.liked_musics.push(createdMusic);
      await authUser.save({ session: sess });
      await sess.commitTransaction();
    }
  }
  console.log("Les musiques liké de l'user ont bien été enregistré dans la BDD liked_musics !");
  
  // Get l'historique de l'utilisateur :
  let currentDate = new Date(); // Date actuelle
  let lastWeekTimestamp = currentDate.getTime() - 7 * 24 * 60 * 60 * 1000; // obtenir la date de la semaine dernière
  console.log('Timestamp pour la semaine dernière == ', lastWeekTimestamp);
  const spotifyUserHistoryResponse = await axios.get(`https://api.spotify.com/v1/me/player/recently-played`, {
    params: { limit: 50, after: lastWeekTimestamp },
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + authUser.accessToken,
      'Content-Type': 'application/json',
    },
  })
  let responseItem = spotifyUserHistoryResponse.data.items;
  
  // Merge les données de l'historique et des features sur chaque musique :
  let mergeMusicsHistory = {};
  for (i in responseItem) {
    let trackArtists = [];
    let trackId = responseItem[i].track.id;
    for (x in responseItem[i].track.artists) { trackArtists.push(responseItem[i].track.artists[x].name); }
    await new Promise(resolve => setTimeout(resolve, 250)); // Attendre 0.5s
    const spotifyMusicHistoryFeaturesRes = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + authUser.accessToken,
        'Content-Type': 'application/json',
      },
    })
    let musicSchema = {
      played_at: responseItem[i].played_at,
      track_id: trackId,
      titre: responseItem[i].track.name,
      artists: trackArtists,
      album_name: responseItem[i].track.album.name,
      album_image: responseItem[i].track.album.images[1].url.substring(24),
      year: responseItem[i].track.album.release_date.substring(0, 4),
      popularity: responseItem[i].track.popularity,
      duration_ms: responseItem[i].track.duration_ms,
      danceability: spotifyMusicHistoryFeaturesRes.data.danceability,
      energy: spotifyMusicHistoryFeaturesRes.data.energy,
      key: spotifyMusicHistoryFeaturesRes.data.key,
      time_signature: spotifyMusicHistoryFeaturesRes.data.time_signature,
      mode: spotifyMusicHistoryFeaturesRes.data.mode,
      loudness: spotifyMusicHistoryFeaturesRes.data.loudness,
      speechiness: spotifyMusicHistoryFeaturesRes.data.speechiness,
      acousticness: spotifyMusicHistoryFeaturesRes.data.acousticness,
      instrumentalness: spotifyMusicHistoryFeaturesRes.data.instrumentalness,
      valence: spotifyMusicHistoryFeaturesRes.data.valence,
      tempo: spotifyMusicHistoryFeaturesRes.data.tempo,
      liveness: spotifyMusicHistoryFeaturesRes.data.liveness,
    }
    mergeMusicsHistory[i] = musicSchema; 
  }
  console.log("L'historique d'écoute user & leurs features ont bien été récupéré !");

  // Remplir la BDD user_histories :
  const oneWeekHistory = new UserPlayedHistory({
    pull_timestamp: currentDate,
    user_id: userData.userId,
    musics: mergeMusicsHistory
  });
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await oneWeekHistory.save({ session: sess });
  authUser.user_history.push( oneWeekHistory );
  await authUser.save({ session: sess });
  await sess.commitTransaction();
  console.log("User History ont été stocké dans la BDD user_histories !");

  res.redirect('http://localhost:8083/profil'); // Redirige l'User sur sa page Profil
  console.log("########## ########## END Route ########## ##########");
};


const checkSpotifyAuthentication = async (req, res, next) => {
  console.log("\n########## ########## Check User Spotify Authentication Route ########## ##########");
  
  const userJWTToken = req.headers.authorization; // Récup du userJWTToken dans le header de la requête
  console.log("User JWT Token Header == ", userJWTToken);

  /// Vérification du token utilisateur :
  let userData;
  try {
    userData = jwt.verify(userJWTToken, 'supersecret_dont_share');
    console.log(`Le User "${userData.name}" a bien été authentifié !`);
  } catch (err) {
    const error = new HttpError(
      `Token "${userJWTToken}" inconnu. Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Trouver l'user dans la BDD avec l'userId :
  let user;
  try {
    user = await User.findById(userData.userId);
    console.log(`Le User "${user._id}" a bien été trouvé dans la BDD !`);
  } catch (err) {
    const error = new HttpError(
      `Utilisateur "${userData.userId}" introuvable dans la BDD... Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  if (user.refreshToken) {
    // Échange du code d'autorisation contre un access token :
    const spotifyTokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: user.refreshToken,
      }), {
        headers: { 'Authorization': 'Basic ' + (new Buffer.from('60d898c77e92460b8988529b4d3207c4' + ':' + 'ea177528ae92405cbeb3a38dd259407b').toString('base64')) },
      }
    );
    const accessToken = spotifyTokenResponse.data.access_token; // récup du access_token
    try {
      user.accessToken = accessToken;
      await user.save();
      console.log(`L'accessToken de l'User "${user._id}" a bien été mise à jour dans la BDD !`);
    } catch (err) {
    }
    res.json({ authenticated: true, refresh_token: user.refreshToken, access_token: user.accessToken });
  } else {
    res.json({ authenticated: false });
  }
  console.log("########## ########## END Route ########## ##########");
};


const refreshSpotifyAccessToken = async (req, res, next) => {
  console.log("\n########## ########## Refresh User Spotify access_token Route ########## ##########");
  const userJWTToken = req.headers.authorization; // Récup du userJWTToken dans le header de la requête
  console.log("User JWT Token Header == ", userJWTToken);

  /// Vérification du token utilisateur :
  let userData;
  try {
    userData = jwt.verify(userJWTToken, 'supersecret_dont_share');
    console.log(`Le User "${userData.name}" a bien été authentifié !`);
  } catch (err) {
    const error = new HttpError(
      `Token "${userJWTToken}" inconnu. Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Trouver l'user dans la BDD avec l'userId :
  let user;
  try {
    user = await User.findById(userData.userId);
    console.log(`Le User "${user._id}" a bien été trouvé dans la BDD !`);
  } catch (err) {
    const error = new HttpError(
      `Utilisateur "${userData.userId}" introuvable dans la BDD... Veuillez réessayer.`,
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Échange du code d'autorisation contre un access token :
  const spotifyTokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
    }), {
      headers: { 'Authorization': 'Basic ' + (new Buffer.from('60d898c77e92460b8988529b4d3207c4' + ':' + 'ea177528ae92405cbeb3a38dd259407b').toString('base64')) },
    }
  );
  const accessToken = spotifyTokenResponse.data.access_token; // récup du access_token
  try {
    user.accessToken = accessToken;
    await user.save();
    console.log(`L'accessToken de l'User "${user._id}" a bien été mise à jour dans la BDD !`);
  } catch (err) {
  }
  res.json({ access_token: user.accessToken });
  console.log("########## ########## END Route ########## ##########");
};

exports.initiateSpotifyAuth = initiateSpotifyAuth;
exports.handleSpotifyCallback = handleSpotifyCallback;
exports.checkSpotifyAuthentication = checkSpotifyAuthentication;
exports.refreshSpotifyAccessToken = refreshSpotifyAccessToken;