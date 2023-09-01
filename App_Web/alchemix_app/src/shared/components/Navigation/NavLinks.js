import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="navlinks-links">
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/welcome">Bienvenue</NavLink>
        </li>
      )}
      <li>
        <NavLink to="/" exact>Utilisateurs</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>Mes places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Ajouter une Place</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/music">Mes recommandations</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/:userId/profil">Profil</NavLink>
        </li>
      )}
      <li>
        <div className='navlinks-separator'></div>
      </li>
      {/* {auth.isLoggedIn && (
        <li>
            <NavLink to="/:userId/profil" className="navlinks-user_image">
              {auth.isLoggedIn && <img src={NoUserImage} alt="user_image"/>}
              {!auth.isLoggedIn && <img src={NoUserImage} alt='no_user_profil_image'/>}
            </NavLink>
        </li>
      )} */}
      {!auth.isLoggedIn && (
        <li className="navlinks-login_button">
          <NavLink to="/auth">Se connecter</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Se déconnecter</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
