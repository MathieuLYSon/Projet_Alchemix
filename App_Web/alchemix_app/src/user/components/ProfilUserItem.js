import React, {useEffect, useState} from 'react';

// import Button from '../../shared/components/FormElements/Button';
import DisplayInfoUser from './DisplayInfoUser'
import DisplayConnectUser from './DisplayConnectUser';
import './ProfilUserItem.css';

const ProfilUserItem = props => {
  const [displayMode, setDisplayMode] = useState();

  useEffect(() => {
    try {
      if (!displayMode) {
        setDisplayMode("Info");
      }
    }  catch (err) {}
  }, [setDisplayMode]);

  const displayManagement = (mode) => {
    if (mode === "Info") {
      setDisplayMode("Info");
    } else if (mode === "Connect") {
      setDisplayMode("Connect");
    }
  }

  return (
    <div className='profil_user_item_container'>
      <div className='profil_header'>
        <div className='user_image'>
          <img
            src={`http://localhost:8082/${props.image}`}
            alt={`introuvable`}
          />
        </div>
        <h2 className='user_name'>{props.name}</h2>
      </div>
      <div className='separator'></div>
      <ul className='user_menu'>
        <li>
          {displayMode === "Info" ? (
            <button onClick={() => displayManagement("Info")} className='active'>
              Mon compte
            </button>
          ) : (
            <button onClick={() => displayManagement("Info")}>
              Mon compte
            </button>
          )}
          
        </li>
        <li>
        {displayMode === "Connect" ? (
          <button onClick={() => displayManagement("Connect")} className='active'>
            Mes connexions
          </button>
        ) : (
          <button onClick={() => displayManagement("Connect")}>
            Mes connexions
          </button>
        )}
          
        </li>
      </ul>
      <div className='separator'></div>
      {displayMode === "Info" && (
        <DisplayInfoUser 
          id={props.id}
          name={props.name}
          email={props.email}
        />
      )}
      {displayMode === "Connect" && <DisplayConnectUser />}
      <div className='spacer'></div>
    </div>
  );
};

export default ProfilUserItem;