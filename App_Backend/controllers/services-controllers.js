const HttpError = require('../models/http-error');
const Service = require('../models/service');

const getAllServices = async (req, res, next) => {
  console.log("\n########## ########## Get all Services Route ########## ##########");
  
  // Trouver tous les Services dans la BDD :
  let services;
  try {
    services = await Service.find({});
    console.log("Les Services ont été trouvé !");
  } catch (err) {
    const error = new HttpError(
      'Services introuvables.',
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Renvoie les datas des Services au Fontend au format JSON :
  res.json({ services: services.map(service => service.toObject({ getters: true })) });
  console.log("########## ########## END Route ########## ##########");
};

const getSpotifyService = async (req, res, next) => {
  console.log("\n########## ########## Get Spotify Service Data Route ########## ##########");

  // Trouver le Service Spotify dans la BDD :
  let service;
  try {
    service = await Service.findOne({ name: 'Spotify'});
    console.log("Le Service Spotify a bien été trouvé !");
  } catch (err) {
    const error = new HttpError(
      'Services Not Find.',
      500
    );
    console.log("ERROR : ", error);
    return next(error);
  }

  // Renvoie les datas du Service Spotify au Fontend au format JSON :
  res.json({ service: service.toObject({ getters: true }) });
  console.log("########## ########## END Route ########## ##########");
};

exports.getAllServices = getAllServices;
exports.getSpotifyService = getSpotifyService;