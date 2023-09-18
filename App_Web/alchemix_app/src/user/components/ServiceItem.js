import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
// import { useHttpClient } from '../../shared/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import axios from 'axios';
import './ServiceItem.css'

const ServiceItem = ( props ) => {
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [spotifyAuthorized, setSpotifyAuthorized] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/services/spotify/authenticated', {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((response) => {
        if (response.data.authenticated) {
          setSpotifyAuthorized(true);
          // auth.loginSpotify();
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification de l'authentification Spotify :", error);
      });
  }, [auth, spotifyAuthorized]);

  const handleSpotifyAuth = () => {
    // Call API --> Backend pour s'authentifier à Spotify pour la prmière fois :
    try {
      axios
      .get(`http://localhost:8082/api/services/spotify/auth`,  {
        headers: {
          Authorization: auth.token,
        }
      })
      .then((response) => {
        // Redirigez l'utilisateur vers l'URL d'authentification Spotify :
        console.log("Response API BACKEND == ", response.data.redirectUrl);
        window.location.href = response.data.redirectUrl;
      })
      .catch((error) => {
        console.error("Erreur lors de l'initiation de l'authentification Spotify :", error);
      });
    } catch (err) {}
    
      
      axios
      .get('http://localhost:8082/api/services/spotify/authenticated', {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((response) => {
        if (response.data.authenticated) {
          setSpotifyAuthorized(true);
          console.log("Spotify Autorized == ", spotifyAuthorized);
          auth.loginSpotify(response.data.access_token, response.data.refresh_token);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification si l'user est authentifié à Spotify : ", error);
      });
  };

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
              <Button onClick={handleSpotifyAuth} disabled={props.inDev}>Se connecter à {props.name}</Button>
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
              {spotifyAuthorized ? (
                <Button onClick={handleSpotifyAuth} /*disabled={spotifyAuthorized}*/ >Déjà connecté !</Button>
                ) : (
                <Button onClick={handleSpotifyAuth}>Se connecter à {props.name}</Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )};

export default ServiceItem;