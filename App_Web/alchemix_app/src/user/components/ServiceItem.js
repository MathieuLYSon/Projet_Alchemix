import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import axios from 'axios';
import './ServiceItem.css'

const ServiceItem = ( props ) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  // const [spotifyAuthorized, setSpotifyAuthorized] = useState(false);
  console.log("UserId == ", auth.userId);
  console.log("User Token == ", auth.token);

  const handleSpotifyAuth = () => {
    // Effectuez une requête GET vers la route `/auth` du backend pour initier l'authentification Spotify
    axios
      .get(`http://localhost:8082/api/services/auth/:${auth.userId}`)
      .then((response) => {
        // Redirigez l'utilisateur vers l'URL d'authentification Spotify
        window.location.href = response.data.redirectUrl;
      })
      .catch((error) => {
        console.error("Erreur lors de l'initiation de l'authentification Spotify :", error);
      });
  };

  // const history = useNavigate();
  // const handleSpotifyLogin = async () => {
  //   try {
  //     // Appelez la route d'authentification Spotify dans le backend
  //     const response = await axios.post(
  //       `http://localhost:8082/api/services/spotify/login/`,
  //       auth.userId,
  //       { Authorization: 'Bearer ' + auth.token }
  //     );
  //     history.push('/');
  //     console.log("Response Spotify == ", response);
  //     // Redirigez l'utilisateur vers l'URL renvoyée par Spotify (l'URL d'authentification)
  //     window.location.href = response.data.authURL;
  //   } catch (error) {
  //     console.error('Erreur lors de la demande d\'authentification Spotify', error);
  //   }
  // };

  // const connectToService = (name) => {
  //   if (name === "Spotify") {
  //     console.log("Connexion à", name, "!")
  //     handleSpotifyLogin();
  //   } else {
  //     console.log("Service introuvable")
  //   }
  // }

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
              {/* <a href={`http://localhost:8082/api/services/spotify/login/${auth.userId}`}>Se connecter à Spotify</a> */}
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
              <Button onClick={handleSpotifyAuth}>Se connecter à {props.name}</Button>
              {/* <a href={`http://localhost:8082/api/services/spotify/login/${auth.userId}`}>Se connecter à Spotify</a> */}
            </div>
          </div>
        </Card>
      )}
    </div>
  )};

export default ServiceItem;