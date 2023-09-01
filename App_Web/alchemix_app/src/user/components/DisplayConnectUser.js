import React from 'react';

import { ConnexionService } from './ConnexionService';
import ServiceItem from './ServiceItem';
import './DisplayConnectUser.css';

const DisplayConnectUser = props => {

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