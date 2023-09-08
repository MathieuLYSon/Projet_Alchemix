const express = require('express');
// const session = require('express-session');

const servicesControllers = require('../controllers/services-controllers');

const router = express.Router();

// router.use(session({ secret: '12', resave: true, saveUninitialized: true }));
// router.use(passport.initialize());
// router.use(passport.session());

router.get('/', servicesControllers.getAllServices);

router.get('/spotify', servicesControllers.getSpotifyService);

router.get('/auth/:uid', servicesControllers.initiateSpotifyAuth);

// Route de redirection après l'autorisation de Spotify
router.get('/callback', servicesControllers.handleSpotifyCallback);

// router.post('spotify/login/', servicesControllers.spotifyLogin);

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// passport.use(
//   new SpotifyStrategy(
//     {
//       clientID: '60d898c77e92460b8988529b4d3207c4',
//       clientSecret: 'ea177528ae92405cbeb3a38dd259407b',
//       callbackURL: 'http://localhost:8082/api/services/spotify/login/callback', // L'URI de redirection
//     },
//     async ( accessToken, refreshToken, expires_in, profile, done) => {
//       // Stockez ou mettez à jour les informations utilisateur dans MongoDB
//       // Accédez à l'ID utilisateur de votre application (si déjà connecté)
//       const userId = req.user ? req.user._id : null;
//       console.log("User ID == ", userId);
//       // try {
//         // let user = await User.findOne({ spotifyId: profile.id });
//         // if (!user) {
//         //   let user = await User.findById({ id: userId });
//         //   console.log("Nouveau User : ");
//         //   // user = new User({
//         //   //   spotifyId: profile.id,
//         //   //   displayName: profile.displayName,
//         //   //   accessToken,
//         //   //   refreshToken,
//         //   // });
//         //   await user.save();
//         // } else {
//         //   user.accessToken = accessToken;
//         //   user.refreshToken = refreshToken;
//         //   await user.save();
//       // }
      
//       // L'ID Spotify de l'utilisateur connecté à Spotify
//       const spotifyUserId = profile.id;
//       // Mettez à jour ou associez l'ID Spotify à l'utilisateur de votre application
//       try {
//         let user = await User.findById(userId);
//         if (!user) {
//           // Gérez le cas où l'utilisateur n'est pas connecté à votre application
//           return done(null, false, { message: 'L\'utilisateur n\'est pas connecté à votre application.' });
//         }
//         // Assurez-vous que l'utilisateur a bien l'ID Spotify associé
//         user.spotifyId = spotifyUserId;
//         user.accessToken = accessToken;
//         user.refreshToken = refreshToken;
//         await user.save();
//         return done(null, user);
//       } catch (error) {
//         return (error);
//       }
//     }
//   )
// );

// router.get('/spotify/login', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private', 'user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'user-follow-read', 'user-follow-modify'] }));

// router.get('/spotify/login/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
//   // Générez un JWT pour l'utilisateur
//   const payload = {
//     userId: req.user._id, // L'ID de l'utilisateur dans votre application
//     spotifyAccessToken: req.user.accessToken, // Le token d'accès Spotify
//     // Autres informations utilisateur que vous souhaitez inclure dans le JWT
//   };
//   // Signez le JWT
//   const token = jwt.sign(payload, 'votre_secret', { expiresIn: '1h' });

//   // Redirigez l'utilisateur ou renvoyez le token JWT dans la réponse
//   res.json({ token }); // Vous pouvez également rediriger l'utilisateur vers sa page de profil, par exemple
// });

module.exports = router;