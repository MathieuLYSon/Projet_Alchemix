import React, { useEffect, useState } from 'react';

import MusicsList from '../components/MusicsList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const RecommandationPage = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const responseData = await sendRequest(
              'http://localhost:5000/api/music'
            );
            console.log(responseData.existingmusics)
            setLoadedUsers(responseData.existingmusics);
          } catch (err) {}
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                <LoadingSpinner />
                </div>
            )}
        {!isLoading && loadedUsers && <MusicsList items={loadedUsers} />}
        </React.Fragment>
      );
};

export default RecommandationPage;