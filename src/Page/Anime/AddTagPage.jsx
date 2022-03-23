import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as animeApi from '../../Firebase/anime';
import { Button, TextField, Snackbar, IconButton, List, ListItem, ListItemText, Chip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../Provider/AuthProvider';
import styles from './create-item-page.module.scss';

const CreateItemPage = (props) => {
  let original = {
    name: ''
  };

  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [name, setName] = useState(original.name);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [snackBarMessage, setSnackBarMessage] = useState('');
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

  const getTagList = async () => {
    setLoading(true);
    const list = await animeApi.getTagList();
    setItemList(list.sort((a, b) => a.name > b.name ? 1 : -1));
    setLoading(false);
  };

  const onSave = async () => {
    // call api
    const item = {
      name
    };

    animeApi.addTag(userId, item)
      .then(() => {
        handleSnackBarOpen('Success!');
        setName('');
      })
      .catch(err => {
        handleSnackBarOpen(err);
      });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    getTagList();
  }, [snackBarMessage]);

  return (
    <div>
      <h1>Add tag</h1>
      <TextField fullWidth label="Name" value={name} name="name" onChange={handleNameChange}/>
      <Button className={styles.button} variant="contained" color="primary" onClick={onSave}>Save</Button>    
      <List component="nav" style={{ maxHeight: 500, width: 400, overflow: 'auto'}}>
        {itemList.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List> 
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
    </div>
  );
};

// location is required when edit mode is selected from existing item
CreateItemPage.propTypes = {
  location: PropTypes.object
};

export default CreateItemPage;