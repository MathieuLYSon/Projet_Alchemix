import React from 'react';
import LikeMusicItem from './LikeMusicItem';
import Card from '../../shared/components/UIElements/Card';
import './LikeMusicsList.css'

const LikeMusicsList = props => {
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
        <LikeMusicItem
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

export default LikeMusicsList;