import React from 'react';

import ProfilUserItem from './ProfilUserItem';
import './ProfilUserList.css';

const ProfilUserList = props => {
  if (props.items.length === 0) {
    return (
      <div className="user_profil_list center">
        <h2>Vous n'êtes pas connecté.</h2>
      </div>
    );
  }

  return (
    <div className='profil_user_item-container'>
      {props.items.map(user => (
        <ProfilUserItem 
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
          image={user.image}
        />
      ))}
    </div>
  );
};

export default ProfilUserList;
