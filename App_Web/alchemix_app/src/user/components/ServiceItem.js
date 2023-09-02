import React, {useContext} from 'react';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import SpotifyWebApi from 'spotify-web-api-js';
import './ServiceItem.css'
// import { useAuth } from '../../shared/hooks/auth-hook';
import { AuthContext } from '../../shared/context/auth-context';

const ServiceItem = props => {
  const auth = useContext(AuthContext);
  const spotifyApi = new SpotifyWebApi();
  const clientID = '60d898c77e92460b8988529b4d3207c4';
  // L'URI de redirection de votre application
  const redirectURI = `http://localhost:3000/`;

  const componentDidMount = () => {
    // Vérifiez si nous avons le code d'accès dans l'URL (après la redirection depuis Spotify)
    // const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const params = getHashParams();
    // const accessToken = queryParams.get('access_token');
    const accessToken = params.access_token;

    if (accessToken) {
      // Stockez le jeton d'accès dans l'objet spotifyApi
      spotifyApi.setAccessToken(accessToken);
    } else {
      // Si nous n'avons pas de jeton d'accès, redirigez l'utilisateur vers la page d'authentification Spotify
      authenticateSpotify();
    }
  }

  const authenticateSpotify = () => {
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token`;
    window.location.href = authURL;
  }

  const getHashParams = () => {
    const hashParams = {};
    const hash = window.location.hash.substring(1);
    const params = hash.split('&');
    params.forEach(param => {
      const [key, value] = param.split('=');
      hashParams[key] = decodeURIComponent(value);
    });
    console.log("Hash Params == ", hashParams);
    return hashParams;
  }

  const connectToService = (name) => {
    if (name === "Spotify") {
      console.log("Connexion à", name, "!")
      componentDidMount()
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
              <Button onClick={() => connectToService(props.name)}>Se connecter à {props.name}</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ServiceItem;