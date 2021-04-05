import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useAuth } from '../../Provider/AuthProvider';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import './ForgotPasswordPage.scss';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState();
  const [errorText, setErrorText] = useState();
  
  const onSignUp = async () => {
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);  
    if(!emailValid) {
      setErrorText('email is invalid!');
      return;
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const onItemInputChange = e => {
    setEmail(e.target.value);
  };

  return (
    <div className='forgot-password-page-root'>
      <div className='email-wrapper'>
        <div className='title-wrapper'>
          <div className='title'>Password Reset</div>
        </div>
        {message && 
          <Alert severity='success'>
            <AlertTitle>Success</AlertTitle>
            {message}
          </Alert>
        }
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className='input-field' id="email" name="email" label="Email" 
          value={email} onChange={onItemInputChange} helperText={errorText} />
        <Button variant="contained" color="primary" onClick={onSignUp}>Reset Password</ Button>
        <div className='signin-wrapper'>
          Or  <Link to='/signin'>Sign In</Link>
        </div>
      </div>
      <div>
        Need an account <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
