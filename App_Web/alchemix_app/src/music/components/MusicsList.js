import React from 'react';

import MusicItem from './MusicItem';
import Card from '../../shared/components/UIElements/Card';
import './MusicsList.css'

const MusicsList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No musics found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="musics-list">
      {props.items.map(music => (
        <MusicItem
          key={music.id}
          id={music.id}
          name={music.name}
          artiste={music.artiste}
          note={music.note}
        />
      ))}
    </ul>
  );
};

export default MusicsList;