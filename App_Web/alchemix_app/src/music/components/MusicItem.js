import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './MusicItem.css'


const MusicItem = props => {
  return (
    <li className="music-item">
      <Card className="music-item__content">
        <Link to={`/${props.id}/music`}>
          <div className="music-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="music-item__info">
            <h2>{props.name}</h2>
            <h3>{props.artiste}</h3>
            <p>Note : {props.note}/10</p>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default MusicItem;