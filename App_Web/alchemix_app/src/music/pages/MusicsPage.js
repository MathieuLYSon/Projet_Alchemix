import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LikeMusicsList from '../components/LikeMusicsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import axios from 'axios';

const MusicsPage = () => {
    const { isLoading, error, clearError } = useHttpClient();
    const [loadedLikeMusicsUser, setLoadedLikeMusicsUser] = useState();
    const auth = useContext(AuthContext);

    useEffect(() => {
      axios
      .get(`http://localhost:8082/api/music/liked/${auth.userId}`, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((response) => {
        console.log(response.data.userMusicsLiked)
        setLoadedLikeMusicsUser(response.data.userMusicsLiked);
      })
      .catch((error) => {
        console.error("Erreur lors de la vérification de l'authentification Spotify :", error);
      });
    }, [auth]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                <LoadingSpinner />
                </div>
            )}
        {!isLoading && loadedLikeMusicsUser && <LikeMusicsList items={loadedLikeMusicsUser} />}
        </React.Fragment>
      );
};

export default MusicsPage;