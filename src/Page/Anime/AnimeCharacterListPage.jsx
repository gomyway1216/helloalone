import React, { useState, useEffect } from 'react';
import * as animeCharacterApi from '../../Firebase/animeCharacter';
import { Backdrop, CircularProgress } from '@material-ui/core';

const AnimeCharacterListPage = () => {
  const [loading, setLoading] = useState(true);
  const [characterList, setCharacterList] = useState([]);

  const getCharacterList = async () => {
    setLoading(true);
    const characterList = await animeCharacterApi.getCharacterList();
    setCharacterList(characterList);
    setLoading(false);
  };

  useEffect(() => {
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
      <h1>Anime Character List</h1>
      <div>
        <div>
          {characterList.map((character) => 
            <div key={character.id}>{character.name_english + ' / ' + character.name_japanese}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeCharacterListPage;