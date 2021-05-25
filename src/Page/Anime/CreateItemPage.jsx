import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as animeApi from '../../Firebase/anime';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { useAuth } from '../../Provider/AuthProvider';
import MarkdownEditor from 'rich-markdown-editor';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';

const CreateItemPage = (props) => {
  let original = {
    name: '',
    description: '',
    file: null
  };
  let docId = null;
  if(props.location && props.location.state && props.location.state.item) {
    original = props.location.state.item;
    docId = original.id;
  }

  const [name, setName] = useState(original.name);
  const [description, setDescription] = useState(original.description);
  const [file, setFile] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseStatus, setResponseStatus] = useState({});
  const history = useHistory();

  const uploadImage = async (file) => {
    const downloadURL = await animeApi.getStorageRef(file);
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

    if(!userId || !name || !description) {
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
        <div style={{ fontSize: 'x-large' }}>Please upload the main image</div>
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
      <TextField id="standard-basic" label="Name" value={name} name="name" onChange={handleNameChange}/>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant="contained" onClick={() => history.push('/')}>Close</Button>
        <Button variant="contained" color="primary" onClick={onSave}>Save</Button>     
      </div>
      <div className="editor">
        <MarkdownEditor
          defaultValue={description}
          onChange={(getValue) => {
            setDescription(getValue());
          }}
          uploadImage={uploadImage}
          onShowToast={(message) => toast(message)}
        />
      </div>
      <ResponseDialog open={dialogOpen} responseStatus={responseStatus} onClose={handleDialogClose} />
    </div>
  );
};

CreateItemPage.propTypes = {
  location: PropTypes.any
};

export default CreateItemPage;