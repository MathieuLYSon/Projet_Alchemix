import React from 'react';

import RecoMusicItem from './RecoMusicItem';
import Card from '../../shared/components/UIElements/Card';
import './RecoMusicsList.css'

const RecoMusicsList = props => {
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
        <RecoMusicItem
          key={music.id}
          id={music.id}
          name={music.titre}
          albumName={music.album_name}
          albumImage={music.album_image}
          year={music.year}
          artists={music.artists}
          isLiked={music.liked}
          note={music.note}
        />
      ))}
    </ul>
  );
};

export default RecoMusicsList;