import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as voiceActorApi from '../../Firebase/voiceActor';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { useAuth } from '../../Provider/AuthProvider';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import styles from './add-voice-actor-page.module.scss';

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const AddVoiceActorPage = (props) => {
  let original = {
    image: '',
    name_english: '',
    name_japanese: '',
    name_japanese_ruby: ''
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.voiceActor) {
    original = props.location.state.voiceActor;
    docId = original.id;
  }

  const [vaInput, setVaInput] = useState({
    englishName: original.name_english,
    japaneseName: original.name_japanese,
    japaneseNameRuby: original.name_japanese_ruby
  });
  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const history = useHistory();
  const userId = currentUser.uid;
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleNameChange = e => {
    setVaInput({
      ...vaInput,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async () => {
    let downloadURL = null;
    try {
      if (file) {
        downloadURL = await voiceActorApi.getStorageRef(userId, file);
      }
    } catch(err) {
      setResponseStatus({
        isError: true,
        errorMessage: err
      });
      setDialogOpen(true);
    }

    if(!userId || !vaInput.englishName || !vaInput.japaneseName || !vaInput.japaneseNameRuby || (!downloadURL && !original.image)) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    const voiceActor = {
      name_english: vaInput.englishName,
      name_japanese: vaInput.japaneseName,
      name_japanese_ruby: vaInput.japaneseNameRuby,
      image: downloadURL ? downloadURL : original.image
    };
    if(docId) {
      voiceActor.docId = docId;
    }

    voiceActorApi.addVoiceActor(userId, voiceActor)
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
      history.push('/voice-actor');
    }
  };

  return (
    <div className={styles.root}>
      <h1>Add Voice Actor</h1>
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
      <TextField fullWidth label="English Name" value={vaInput.englishName} name="englishName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name" value={vaInput.japaneseName} name="japaneseName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name Ruby" value={vaInput.japaneseNameRuby} name="japaneseNameRuby" onChange={handleNameChange}/>
      <div className="submission">
        <Button className="button" variant="contained" onClick={() => history.push('/voice-actor')}>Close</Button>
        <Button className="button" variant="contained" color="primary" onClick={onSave}>Save</Button>     
      </div>
      <ResponseDialog open={dialogOpen} responseStatus={responseStatus} onClose={handleDialogClose} />
    </div>
  );
};

AddVoiceActorPage.propTypes = {
  location: PropTypes.object
};

export default AddVoiceActorPage;