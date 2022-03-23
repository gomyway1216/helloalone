import React, { useState, useEffect } from 'react';
import * as voiceActorApi from '../../Firebase/voiceActor';
import { useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@material-ui/core';
import CustomListItem from '../../Component/VoiceActor/CustomListItem';
import styles from './voice-actor-page.module.scss';


const VoiceActorPage = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [voiceActor, setVoiceActor] = useState();
  const [characterList, setCharacterList] = useState([]);

  const getVoiceActor = async () => {
    setLoading(true);
    const voiceActor = await voiceActorApi.getVoiceActor(id);
    setVoiceActor(voiceActor);
    setLoading(false);
  };

  const getCharacterList = async () => {
    setLoading(true);
    const characterList = await voiceActorApi.getCharacterList(id);
    setCharacterList(characterList);
    setLoading(false);
  };

  useEffect(() => {
    getVoiceActor();
    getCharacterList();
  }, []);

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <h1>{voiceActor.name_english} / {voiceActor.name_japanese}</h1>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={voiceActor.image} alt="Voice Actor Image"/>
        </div>
        <div className={styles.animeListContainer}>
          {characterList.map((character) => 
            <CustomListItem key={character.id} item={character} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceActorPage;