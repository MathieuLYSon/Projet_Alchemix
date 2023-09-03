import React /*,{useContext}*/ from 'react';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
// import SpotifyWebApi from 'spotify-web-api-js';
import './ServiceItem.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { useAuth } from '../../shared/hooks/auth-hook';
// import { AuthContext } from '../../shared/context/auth-context';

const ServiceItem = props => {
  // const auth = useContext(AuthContext);
  // const spotifyApi = new SpotifyWebApi();
  // const clientID = '60d898c77e92460b8988529b4d3207c4';
  // const redirectURI = `http://localhost:3000/`;

  // const handleLoginClick = () => {
  //   const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token`;
    
  //   // Ouvrez une nouvelle fenêtre contextuelle pour l'authentification
  //   const popup = window.open(authURL, 'Spotify Login', 'width=400,height=600');

  //   // Attendez que la fenêtre contextuelle se ferme (utilisateur authentifié)
  //   const checkPopupClosed = setInterval(() => {
  //     if (!popup || popup.closed || popup.closed === undefined) {
  //       clearInterval(checkPopupClosed);
  //       // Effectuez des actions après l'authentification ici, par exemple, récupérez le jeton
  //       handleAccessToken();
  //     }
  //   }, 1000);
  // };

  // const handleAccessToken = () => {
  //   // Vous pouvez extraire le jeton d'accès de la fenêtre contextuelle ici (utilisez window.opener)
  //   const queryParams = new URLSearchParams(window.location.hash.substring(1));
  //   const accessToken = queryParams.get('access_token');
  //   console.log("Access Token == ", accessToken);

  //   if (accessToken) {
  //     // Stockez le jeton d'accès dans l'objet spotifyApi
  //     spotifyApi.setAccessToken(accessToken);

  //     // Vous pouvez maintenant effectuer des appels à l'API Spotify
  //   }
  // };

  const handleSpotifyLogin = async () => {
    try {
      // Appelez la route d'authentification Spotify dans le backend
      const response = await axios.get('http://localhost:5000/api/services/spotify/login');
      
      // Redirigez l'utilisateur vers l'URL renvoyée par Spotify (l'URL d'authentification)
      window.location.href = response.data.authURL;
    } catch (error) {
      console.error('Erreur lors de la demande d\'authentification Spotify', error);
    }
  };

  const connectToService = (name) => {
    if (name === "Spotify") {
      console.log("Connexion à", name, "!")
      // handleLoginClick()
      handleSpotifyLogin();
    } else {
      console.log("Service introuvable")
    }
  }

  return (
    <div className='service_item_container'>
      {props.inDev === true ? (
        <Card className="service_in_dev">
          <div className="service_item">
            <div className='service_image'>
              <img
                src={`/img/${props.imageUrl}`}
                alt={`introuvable`}
              />
            </div>
            <div className='service_info'>
              <h2>{props.name}</h2>
              {props.inDev === true ? (
                <p>En Développement...</p>
              ) : (
                <p>Terminé</p>
              )}
              <Button onClick={() => connectToService(props.name)} disabled={props.inDev}>Se connecter à {props.name}</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card >
          <div className="service_item">
            <div className='service_image'>
              <img
                src={`/img/${props.imageUrl}`}
                alt={`introuvable`}
              />
            </div>
            <div className='service_info'>
              <h2>{props.name}</h2>
              {props.inDev === true ? (
                <p>En Développement...</p>
              ) : (<p></p>)}
              <Button /*onClick={() => connectToService(props.name)}*/><Link to={'/auth/spotify'}>Se connecter à {props.name}</Link></Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ServiceItem;