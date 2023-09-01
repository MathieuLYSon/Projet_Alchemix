import React from 'react';

// import Button from '../../shared/components/FormElements/Button';
import './DisplayInfoUser.css'

const DisplayInfoUser = props => {

  return (
    <div className='display_info_user_container'>
      <h2>Vue d'ensemble du compte</h2>
      <h3>Profil</h3>
      <div className='list_user_info'>
        <p className='list_info_left'> Nom d'utilisateur </p>
        <p className='list_info_right'>{props.name}</p>
        <p className='list_info_left'>Email </p>
        <p className='list_info_right'>{props.email}</p>
        <p className='list_info_left'> ID </p>
        <p className='list_info_right'>{props.id}</p>
      </div>
    </div>
  );
};

export default DisplayInfoUser;