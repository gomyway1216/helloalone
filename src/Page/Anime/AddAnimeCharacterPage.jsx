import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as voiceActorApi from '../../Firebase/voiceActor';
import * as animeApi from '../../Firebase/anime';
import * as animeCharacterApi from '../../Firebase/animeCharacter';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { useAuth } from '../../Provider/AuthProvider';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './add-anime-character-page.module.scss';

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const AddAnimeCharacterPage = (props) => {
  let original = {
    image: '',
    name_english: '',
    name_japanese: '',
    name_japanese_ruby: '',
    anime_id: '',
    voice_actor_id: ''
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.animeCharacter) {
    original = props.location.state.animeCharacter;
    docId = original.id;
  }

  const [animeCharacterInput, setAnimeCharacterVaInput] = useState({
    englishName: original.name_english,
    japaneseName: original.name_japanese,
    japaneseNameRuby: original.name_japanese_ruby,
    anime_id: original.anime_id,
    voice_actor_id: original.voice_actor_id
  });

  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const history = useHistory();
  const userId = currentUser.uid;
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [animeSelectValue, setAnimeSelectValue] = useState({name_english: ''});
  const [animeInputValue, setAnimeInputValue] = useState('');
  const [voiceActorSelectValue, setVoiceActorSelectValue] = useState({name_english: ''});
  const [voiceActorInputValue, setVoiceActorInputValue] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [voiceActorList, setVoiceActorList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAnimeList = async () => {
    setLoading(true);
    const list = await animeApi.getAnimeItemList();
    setAnimeList(list);
    setLoading(false);
  };

  const getVoiceActorList = async () => {
    setLoading(true);
    const list = await voiceActorApi.getVoiceActorList();
    setVoiceActorList(list);
    setLoading(false);
  };

  useEffect(() => {
    getAnimeList();
    getVoiceActorList();
  }, []);

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleNameChange = e => {
    setAnimeCharacterVaInput({
      ...animeCharacterInput,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async () => {
    let downloadURL = null;
    try {
      if (file) {
        downloadURL = await animeCharacterApi.getStorageRef(userId, file);
      }
    } catch(err) {
      setResponseStatus({
        isError: true,
        errorMessage: err
      });
      setDialogOpen(true);
    }

    if(!userId || !animeCharacterInput.englishName || !animeCharacterInput.japaneseName || !animeCharacterInput.japaneseNameRuby || (!downloadURL && !original.image) || !animeSelectValue || !voiceActorSelectValue) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    const animeCharacter = {
      name_english: animeCharacterInput.englishName,
      name_japanese: animeCharacterInput.japaneseName,
      name_japanese_ruby: animeCharacterInput.japaneseNameRuby,
      image: downloadURL ? downloadURL : original.image,
      anime_id: animeSelectValue.id,
      voice_actor_id: voiceActorSelectValue.id
    };
    if(docId) {
      animeCharacter.docId = docId;
    }

    animeCharacterApi.addAnimeCharacter(userId, animeCharacter)
      .then(() => {
        setResponseStatus({
          isError: false
        });
        setDialogOpen(true);
      })
      .catch(err => {
        setResponseStatus({
          isError: true,
          errorMessage: err
        });
        setDialogOpen(true);
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if(!responseStatus.isError) {
      history.push('/anime-character');
    }
  };

  return (
    <div className={styles.root}>
      <h1>Add Anime Character</h1>
      <div>
        <div>Main Image</div>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
          Upload
          </Button>
        </label>
      </div>
      <TextField fullWidth label="English Name" value={animeCharacterInput.englishName} name="englishName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name" value={animeCharacterInput.japaneseName} name="japaneseName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name Ruby" value={animeCharacterInput.japaneseNameRuby} name="japaneseNameRuby" onChange={handleNameChange}/>
      <div className={styles.search}>
        <Autocomplete
          value={animeSelectValue}
          onChange={(animeSelectValue, newValue) => {
            setAnimeSelectValue(newValue);
          }}
          inputValue={animeInputValue}
          onInputChange={(event, newInputValue) => {
            setAnimeInputValue(newInputValue);
          }}
          id="animeList"
          options={animeList}
          style={{ width: 500 }}
          getOptionLabel={(option) => option.name_english && (option.name_english + ' / ' + option.name_japanese)}
          renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
          freeSolo={true}
        />
        <Autocomplete
          value={voiceActorSelectValue}
          onChange={(voiceActorSelectValue, newValue) => {
            setVoiceActorSelectValue(newValue);
          }}
          inputValue={voiceActorInputValue}
          onInputChange={(event, newInputValue) => {
            setVoiceActorInputValue(newInputValue);
          }}
          id="voiceActorList"
          options={voiceActorList}
          style={{ width: 500 }}
          getOptionLabel={(option) => option.name_english && (option.name_english + ' / ' + option.name_japanese)}
          renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
          freeSolo={true}
        />
      </div>
      <div className="submission">
        <Button className="button" variant="contained" onClick={() => history.push('/anime-character')}>Close</Button>
        <Button className="button" variant="contained" color="primary" onClick={onSave}>Save</Button>     
      </div>
      <ResponseDialog open={dialogOpen} responseStatus={responseStatus} onClose={handleDialogClose} />
    </div>
  );
};

AddAnimeCharacterPage.propTypes = {
  location: PropTypes.object
};

export default AddAnimeCharacterPage;