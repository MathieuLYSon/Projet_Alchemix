import React from 'react';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import './ServiceItem.css'

const ServiceItem = props => {
    
  const connectToSpotify = () => {
    console.log("Connexion à Spotify !")
  }

  return (
    <div className='service_item_container'>
      <Card >
        <div className="service_item_info">
          <img
            src={props.imageUrl}
            alt={`introuvable`}
          />
          <h2>{props.name}</h2>
          {props.inDev === true ? (
            <p>En Développement...</p>
          ) : (
            <p>Terminé</p>
          )}
        </div>
        <Button onClick={connectToSpotify}>Se connecter à Spotify</Button>
      </Card>
    </div>
  );
};

export default ServiceItem;