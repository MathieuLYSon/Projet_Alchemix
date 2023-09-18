import React, { useContext, useState } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import MusicLikedPicto from '../../assets/images/Picto_music_liked.png'
import MusicNotLikedPicto from '../../assets/images/Picto_music_not_liked.png'
import axios from 'axios';
import './RecoMusicItem.css'

const RecoMusicItem = props => {
  const auth = useContext(AuthContext);
  const [NewNote, setNewNote] = useState(props.note);


  const handleModifyRankMusic = (note, musicId) => {
    console.log("Note == ", note);
    console.log("Music ID == ", musicId);
    axios
    .get(`http://localhost:8082/api/music/recommended/${auth.userId}/${musicId}`,  {
      params: { note: note },
      headers: {
        Authorization: auth.token,
      }
    })
    .then((response) => {
      // Set la nouvelle note de la music :
    })
    .catch((error) => {
      console.error("Erreur lors de la vérification de l'authentification Spotify :", error);
    });
    setNewNote(note);
  }

  return (
    <li className="music_item_container">
      <Card className="music_item_card">
        <div className="music_item_firt">
          <img src={`http://localhost:8082/${props.albumImage}`} alt={props.name} />
        </div>
        <div className="music_item_second">
          <h2>{props.name}</h2>
          {props.artists.length < 0 ? (
            <h3>Artiste : {props.artists}</h3>
          ) : (
            <h3>Artiste : {props.artists}</h3>
          )}
          <h3>Album : {props.albumName}</h3>
          <h3>Sortie : {props.year}</h3>
        </div>
        <div className="music_item_third">
          <label>Note : </label>
          <select  value={NewNote} onChange={e => handleModifyRankMusic(e.target.value, props.id)}>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
          <p> /10</p>
        </div>
        <div className="music_item_fourth">      
          {props.isLiked ? (
            <img src={MusicLikedPicto} alt={props.isLiked} />
          ) : (
            <img src={MusicNotLikedPicto} alt={props.isLiked} />
          )}
        </div>
      </Card>
    </li>
  );
};

export default RecoMusicItem;