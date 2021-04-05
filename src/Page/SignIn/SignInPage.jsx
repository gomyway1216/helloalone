import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useAuth } from '../../Provider/AuthProvider';
import './SignInPage.scss';

const defaultInput = {
  email: '',
  password: ''
};

const SignInPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const history = useHistory();
  const { signIn } = useAuth();
  
  const onSignIn = async () => {
    const { email, password } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

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

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
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
    <div className='signin-page-root'>
      <div className='signin-wrapper'>
        <div className='title-wrapper'>
          <div className='title'>Sign In</div>
        </div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className='input-field' id="email" name="email" label="email" 
          value={itemInput.email} onChange={onItemInputChange} helperText={errorText.email}/>
        <TextField className='input-field' id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} helperText={errorText.password} />
        <Button variant="contained" color="primary" onClick={onSignIn}>Sign In</ Button>
        <div className='forgot-password-wrapper'>
          Forgot password? <Link to='/forgot-password'>Forgot password?</Link>
        </div>
      </div>
      <div>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInPage;
