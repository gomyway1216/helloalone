import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as animeApi from '../../Firebase/anime';
import { useHistory } from 'react-router-dom';
import { Button, Backdrop, CircularProgress, TextField, Snackbar, IconButton } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAuth } from '../../Provider/AuthProvider';
import MarkdownEditor from 'rich-markdown-editor';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import styles from './create-item-page.module.scss';

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const CreateItemPage = (props) => {
  let original = {
    name_english: '',
    name_japanese: '',
    description: '',
    tags: [],
    score: '',
    file: null
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.item) {
    original = props.location.state.item;
    docId = original.id;
  }

  const [nameInput, setNameInput] = useState({
    englishName: original.name_english,
    japaneseName: original.name_japanese,
    japaneseNameRuby: original.name_japanese_ruby
  });

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(original.description);
  const [tags, setTags] = useState(original.tags);
  const [score, setScore] = useState(original.score);
  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const history = useHistory();
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [tagList, setTagList] = useState([]);

  const getTagList = async () => {
    setLoading(true);
    const tagList = await animeApi.getTagList();
    setTagList(tagList);
    setLoading(false);
  };

  useEffect(() => {
    getTagList();
  }, []);

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

    if(!userId || !nameInput.englishName || !nameInput.japaneseName || !nameInput.japaneseNameRuby || !description || !tags || !score || isNaN(score) || (!downloadURL && !original.mainImage)) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    const item = {
      user: userId,
      name_english: nameInput.englishName,
      name_japanese: nameInput.japaneseName,
      name_japanese_ruby: nameInput.japaneseNameRuby,
      description: description,
      tags: tags,
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
    setNameInput({
      ...nameInput,
      [e.target.name]: e.target.value,
    });
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

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className={styles.root}>
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
      <TextField fullWidth label="English Name" value={nameInput.englishName} name="englishName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name" value={nameInput.japaneseName} name="japaneseName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name Ruby" value={nameInput.japaneseNameRuby} name="japaneseNameRuby" onChange={handleNameChange}/>
      <Autocomplete
        multiple
        id="tags"
        value={tags}
        onChange={(event, newValue) => {
          setTags([...newValue]);
        }}
        options={tagList}
        getOptionLabel={(option) => option.name}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip key={index} label={option.name} {...getTagProps({ index })} />
          ))
        }
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            variant="outlined"
            placeholder="Favorites"
          />
        )}
      />
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
      <div className={styles.submission}>
        <Button className={styles.button} variant="contained" onClick={() => history.push('/anime')}>Close</Button>
        <Button className={styles.button} variant="contained" color="primary" onClick={onSave}>Save</Button>     
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