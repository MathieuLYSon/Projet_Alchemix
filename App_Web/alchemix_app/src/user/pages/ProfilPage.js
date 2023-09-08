import React, { useEffect, useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ProfilUserList from '../components/ProfilUserList';
import "./ProfilPage.css"

const UserProfil= props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const auth = useContext(AuthContext);
  const userId = auth.userId;

	useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8082/api/users/${userId}`
        );
        console.log("UserProfil ResponseData == ", responseData.user);
        setLoadedUsers(responseData.user);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId]);

  console.log("UserProfil LoadedUsers == ", loadedUsers);
  return (
		<React.Fragment>
		<ErrorModal error={error} onClear={clearError} />
		{isLoading && (
			<div className="center">
				<LoadingSpinner />
			</div>
		)}
		<div className="user_profil-container">
      {!isLoading && loadedUsers && <ProfilUserList items={loadedUsers} />}
      {console.log("Loaded User == ", loadedUsers)}
		</div>
	</React.Fragment>
  );
};

export default UserProfil;