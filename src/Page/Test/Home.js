import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { getPublicContent } from '../../Api/user';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log('error received in the UI');
        // setContent(_content);
        // setContent('value');
        console.log('_content', _content);
        // setContent(_content.message);
        setContent(_content);
        setSnackbarOpen(_content.statusCode === 403);
        if(_content.statusCode === 403) {
          setErrorMessage('Please sign in again!');
        }    
      }
    );
  }, []);

  const redirectToSignIn = () => {
    console.log('redirectToSignIn called');
    history.push('/testlogin');
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={() => history.push('/testsignin')}>
        Access sign in page
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>status: {content.statusCode}</h3>
        <h3>message: {content.message}</h3>
      </header>
      <Snackbar
        open={snackbarOpen}
        onClose={handleClose}
        message={errorMessage}
        action={action}
      />
    </div>
  );
};

export default Home;
