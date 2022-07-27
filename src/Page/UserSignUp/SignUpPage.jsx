import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { signUp } from '../../api/auth';
import styles from './sign-up-page.module.scss';

const defaultInput = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
};

const SignUpPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const history = useHistory();
  
  const onSignUp = async () => {
    const { username, email, password, passwordConfirm } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

    if (!username) {
      validated = false;
      newErrorText.username = 'username is invalid!';
    } else {
      newErrorText.username = '';
    }

    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);  
    if(!emailValid) {
      validated = false;
      newErrorText.email = 'email is invalid!';
    } else {
      newErrorText.email = '';
    }

    if(!password || password.length < 8) {
      validated = false;
      newErrorText.password = 'password should be at least 8 characters';
    } else {
      newErrorText.password = '';
    }

    if(password !== passwordConfirm) {
      validated = false;
      newErrorText.passwordConfirm = 'password mismatch';
    } else {
      newErrorText.passwordConfirm = '';
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      await signUp(username, email, password);
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
    <div className={styles.signUpPageRoot}>
      <div className={styles.signUpWrapper}>
        <div className={styles.titleWrapper}>Sign Up</div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className={styles.inputField} id="username" name="username" label="username" 
          value={itemInput.username} onChange={onItemInputChange} helperText={errorText.username}/>
        <TextField className={styles.inputField} id="email" name="email" label="email" 
          value={itemInput.email} onChange={onItemInputChange} helperText={errorText.email}/>
        <TextField className={styles.inputField} id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} helperText={errorText.password} />
        <TextField className={styles.inputField} id="passwordConfirm" name="passwordConfirm" label="Password" 
          type="password" value={itemInput.passwordConfirm} onChange={onItemInputChange} helperText={errorText.passwordConfirm} />
        <Button variant="contained" color="primary" onClick={onSignUp}>Sign Up</ Button>
      </div>
      <div>
        Already have an account? <Link to='/user-signin'>Sign In</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
