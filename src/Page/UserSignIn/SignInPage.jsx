import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { signIn } from '../../api/auth';
import styles from './sign-in-page.module.scss';

const defaultInput = {
  username: '',
  password: ''
};

const SignInPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const history = useHistory();
  
  const onSignIn = async () => {
    const { username, password } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

    if(!username) {
      validated = false;
      newErrorText.password = 'username cannot be empty';
    } else {
      newErrorText.password = '';
    }

    if(!password || password.length < 8) {
      validated = false;
      newErrorText.password = 'password should be at least 8 characters';
    } else {
      newErrorText.password = '';
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      await signIn(username, password);
      history.push('/');
    } catch (e) {
      setError(e.message);
    }
    
    setLoading(false);
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.signInPageRoot}>
      <div className={styles.signInWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Sign In</div>
        </div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className={styles.inputField} id="username" name="username" label="username" 
          value={itemInput.username} onChange={onItemInputChange} helperText={errorText.username}/>
        <TextField className={styles.inputField} id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} helperText={errorText.password} />
        <Button variant="contained" color="primary" onClick={onSignIn}>Sign In</ Button>
      </div>
      <div>
        Need an account? <Link to='/user-signup'>Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInPage;