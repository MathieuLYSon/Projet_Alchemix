import React, { useState } from 'react';

import { ConnexionService } from './ConnexionService';
import ServiceItem from './ServiceItem';
import './DisplayConnectUser.css';

const DisplayConnectUser = props => {
  // const [isLoginMode, setIsLoginMode] = useState(true);
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // <if (isLoginMode) {
  //   try {
  //     const responseData = await sendRequest(
  //       'http://localhost:8082/api/users/login',
  //       'POST',
  //       JSON.stringify({
  //         email: formState.inputs.email.value,
  //         password: formState.inputs.password.value
  //       }),
  //       {
  //         'Content-Type': 'application/json'
  //       }
  //     );
  //     auth.login(responseData.userId, responseData.token);
  //   } catch (err) {}
  // }>

  return (
    <div className='display_connect_user_container'>
      {ConnexionService.map(services => (
        <ServiceItem
          key={services.id}
          name={services.name}
          imageUrl={services.imageUrl}
          inDev={services.inDev}
        />
      ))}
    </div>
  );
};

export default DisplayConnectUser;