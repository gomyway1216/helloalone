import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as animeApi from '../../Firebase/anime';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../Provider/AuthProvider';
import MarkdownEditor from 'rich-markdown-editor';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import './create-item-page.scss';

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const CreateItemPage = (props) => {
  let original = {
    name: '',
    description: '',
    score: '',
    file: null
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.item) {
    original = props.location.state.item;
    docId = original.id;
  }

  const [name, setName] = useState(original.name);
  const [description, setDescription] = useState(original.description);
  const [score, setScore] = useState(original.score);
  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const history = useHistory();
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleSnackBarOpen = (message) => {
    setSnackBarMessage(message);
    setOpenSnackBar(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const uploadImage = async (file) => {
    const downloadURL = await animeApi.getStorageRef(userId, file);
    return downloadURL;
  };

  const onSave = async () => {
    // call api
    let downloadURL = null;
    try {
      if(file) {
        downloadURL = await animeApi.getStorageRef(userId, file);
      }
    } catch(err) {
      setResponseStatus({
        isError: true,
        errorMessage: err
      });
      setDialogOpen(true);
    }

    if(!userId || !name || !description || !score || isNaN(score) || (!downloadURL && !original.mainImage)) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    const item = {
      user: userId,
      name: name,
      description: description,
      score: Number(score),
      mainImage: downloadURL ? downloadURL : original.mainImage
    };
    if(docId) {
      item.docId = docId;
    }

    animeApi.addItem(userId, item)
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if(!responseStatus.isError) {
      history.push('/anime');
    }
  };

  return (
    <div>
      <h1>Create item</h1>
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
      <TextField fullWidth label="Name" value={name} name="name" onChange={handleNameChange}/>
      <TextField label="Score" value={score} name="score" onChange={handleScoreChange}/>
      <div className="editor">
        <MarkdownEditor
          defaultValue={description}
          onChange={(getValue) => {
            setDescription(getValue());
          }}
          uploadImage={uploadImage}
          onShowToast={(message) => handleSnackBarOpen(message)}
        />
      </div>
      <div className="submission">
        <Button className="button" variant="contained" onClick={() => history.push('/anime')}>Close</Button>
        <Button className="button" variant="contained" color="primary" onClick={onSave}>Save</Button>     
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message={snackBarMessage}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <ResponseDialog open={dialogOpen} responseStatus={responseStatus} onClose={handleDialogClose} />
    </div>
  );
};

// location is required when edit mode is selected from existing item
CreateItemPage.propTypes = {
  location: PropTypes.object
};

export default CreateItemPage;