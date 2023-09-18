import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import RecoMusicsList from '../components/RecoMusicsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import axios from 'axios';

const RecommandationPage = () => {
    const { isLoading, error, clearError } = useHttpClient();
    const [loadedLikeMusicsUser, setLoadedLikeMusicsUser] = useState();
    const auth = useContext(AuthContext);

    useEffect(() => {
      axios
      .get(`http://localhost:8082/api/music/recommended/${auth.userId}`, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((response) => {
        console.log(response.data.userMusicsRecommended)
        setLoadedLikeMusicsUser(response.data.userMusicsRecommended);
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
        {!isLoading && loadedLikeMusicsUser && <RecoMusicsList items={loadedLikeMusicsUser} />}
        </React.Fragment>
      );
};

export default RecommandationPage;