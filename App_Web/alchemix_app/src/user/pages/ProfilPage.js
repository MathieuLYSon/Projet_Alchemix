import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ProfilUserList from '../components/ProfilUserList';
import "./ProfilPage.css"

const UserProfil= props => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  const userId = "64c105501b3d44cdd1cf00c4";

	useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${userId}`
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
      {!isLoading && loadedUsers && (
        <ProfilUserList items={loadedUsers} />
      )}
		</div>
	</React.Fragment>
  );
};

export default UserProfil;