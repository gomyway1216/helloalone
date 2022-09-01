import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as imageApi from '../../Firebase/imageUpload';
import { useHistory } from 'react-router-dom';
import { Button, Backdrop, CircularProgress, TextField, Snackbar, IconButton } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAuth } from '../../Provider/AuthProvider';
import MarkdownEditor from 'rich-markdown-editor';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import styles from './create-friend-page.module.scss';
import { getActivityTypes, getColleges } from '../../api/friend';
import { getUser } from '../../storage/tokenService';
import MultipleSelect from '../../Component/General/MultipleSelect';

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const CreateFriendPage = (props) => {
  let original = {
    firstName: '',
    middleName: '',
    lastName: '',
    firstNameNative: '',
    lastNameNative: '',
    firstNameNativePhonetic: '',
    lastNameNativePhonetic: '',
    gender: '',
    birthday: null,
    profileImageLink: '',
    otherImageLinks: [],
    shortDescription: '',
    description: '',
    socialMedias: null,
    phoneNumber: 0,
    emailAddress: '',
    created: null,
    lastUpdated: null,
    locationMet: null,
    activities: [],
    nationality: null,
    favoriteFoods: [],
    hobbies: [],
    colleges: [],
    jobs: []
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.item) {
    original = props.location.state.item;
    docId = original.id;
  }

  const [friendInput, setFriendInput] = useState({
    firstName: original.firstName,
    middleName: original.middleName,
    lastName: original.lastName,
    firstNameNative: original.firstNameNative,
    lastNameNative: original.lastNameNative,
    firstNameNativePhonetic: original.firstNameNativePhonetic,
    lastNameNativePhonetic: original.lastNameNativePhonetic,
    gender: original.gender,
    birthday: original.birthday,
    profileImageLink: original.profileImageLink,
    otherImageLinks: original.otherImageLinks,
    shortDescription: original.shortDescription,
    description: original.description,
    socialMedias: original.socialMedias,
    phoneNumber: original.phoneNumber,
    emailAddress: original.emailAddress,
    created: original.created,
    lastUpdated: original.lastUpdated,
    locationMet: original.locationMet,
    activities: original.activities,
    nationality: original.nationality,
    favoriteFoods: original.favoriteFoods,
    hobbies: original.hobbies,
    colleges: original.colleges,
    jobs: original.jobs
  });

  const [loading, setLoading] = useState(false);
  // const [description, setDescription] = useState(original.description);
  // const [tags, setTags] = useState(original.tags);
  // const [score, setScore] = useState(original.score);
  // const [file, setFile] = useState();
  // const { currentUser } = useAuth();
  // const userId = currentUser.uid;
  const user = getUser();
  const userId = user.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const history = useHistory();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // const [tagList, setTagList] = useState([]);
  const [activityTypeEntries, setActivityTypeEntries] = useState([]);
  const [errorText, setErrorText] = useState({});
  const [error, setError] = useState('');

  // const getTagList = async () => {
  //   setLoading(true);
  //   const tagList = await animeApi.getTagList();
  //   setTagList(tagList);
  //   setLoading(false);
  // };

  const [collegeEntryList, setCollegeEntryList] = useState([]);

  const getActivityTypeEntryList = async () => {
    setLoading(true);
    try {
      const entries = await getActivityTypes();
      setActivityTypeEntryList(entries);
      setLoading(false);
    } catch (e) {
      console.log('there is an error fetching activity types', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
  }; 

  const getCollegeEntryList = async () => {
    setLoading(true);
    try {
      const entries = await getColleges();
      setCollegeEntryList(entries);
      setLoading(false);
    } catch (e) {
      console.log('there is an error fetching colleges', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
  };

  useEffect(() => {
    getActivityTypeEntryList();
    getCollegeEntryList();
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
    const downloadURL = await imageApi.getStorageRef(userId, file);
    return downloadURL;
  };

  // const onSave = async () => {
  //   let validated = true;
  //   const newErrorText = { ...errorText };

  //   const {
  //     firstName, middleName,
  //     lastName,
  //     firstNameNative,
  //     lastNameNative,
  //     firstNameNativePhonetic,
  //     lastNameNativePhonetic,
  //     gender,
  //     birthday,
  //     profileImageLink,
  //     otherImageLinks,
  //     shortDescription,
  //     description,
  //     socialMedias,
  //     phoneNumber,
  //     emailAddress,
  //     created,
  //     lastUpdated,
  //     locationMet,
  //     activities,
  //     nationality,
  //     favoriteFoods,
  //     hobbies,
  //     colleges,
  //     jobs
  //   } = friendInput;

  //   if(!firstName) {
  //     validated = false;
  //     newErrorText.firstName = 'firstName is invalid!';
  //   } else {
  //     newErrorText.firstName = '';
  //   }

  //   if(!lastName) {
  //     validated = false;
  //     newErrorText.lastName = 'lastName is invalid!';
  //   } else {
  //     newErrorText.lastName = '';
  //   }

  //   if(!firstNameNative) {
  //     validated = false;
  //     newErrorText.firstNameNative = 'firstNameNative is invalid!';
  //   } else {
  //     newErrorText.firstNameNative = '';
  //   }

  //   if(!lastNameNative) {
  //     validated = false;
  //     newErrorText.lastNameNative = 'lastNameNative is invalid!';
  //   } else {
  //     newErrorText.lastNameNative = '';
  //   }
    
  //   const hobbyIds = [];
  //   if(!hobbies && hobbies.length != 0) {
  //     for(let i = 0; i < hobbies.length; i++) {
  //       const item = activityTypeEntries.find(e => e.name === hobbies[i]);
  //       hobbyIds.push(item.id);
  //     }
  //     if(hobbyIds.length !== activityTypeEntries.length) {
  //       newErrorText.activityTypeEntries = 'some activity type Ids does not exist. Please check them again!';
  //     } else {
  //       newErrorText.activityTypeEntries = '';
  //     }
  //   }



  // }

  const onSave = async () => {
    // call api
    let downloadURL = null;
    try {
      if(file) {
        downloadURL = await imageApi.getStorageRef(userId, file);
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

  const onCollegeInputChange = e => {
    setTypeInput({
      ...typeInput,
      [e.target.name]: e.target.value
    });
  };

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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
      <TextField fullWidth label="English Name" value={nameInput.englishName} name="englishName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name" value={nameInput.japaneseName} name="japaneseName" onChange={handleNameChange}/>
      <TextField fullWidth label="Japanese Name Ruby" value={nameInput.japaneseNameRuby} name="japaneseNameRuby" onChange={handleNameChange}/>
      <MultipleSelect title="College" name="colleges" list={collegeEntryList} 
        items={typeInput.activityCategories} setItems={onCollegeInputChange} freeSolo={true}/>
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
CreateFriendPage.propTypes = {
  location: PropTypes.object
};

export default CreateFriendPage;