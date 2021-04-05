import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useAuth } from '../../Provider/AuthProvider';
import './MyPage.scss';

const defaultInput = {
  email: '',
  password: '',
  passwordConfirm: ''
};

const SignUp = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState();
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const history = useHistory();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  
  const onSignUp = async () => {
    const { email, password , passwordConfirm } = itemInput;
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if(!emailValid) {
      setErrorText({
        ...errorText,
        'email': 'email is invalid!'
      });
    }

    if(!password || password.length < 8) {
      setErrorText({
        ...errorText,
        'password': 'password should be at least 8 characters'
      });
    }

    if(password !== passwordConfirm) {
      setErrorText({
        ...errorText,
        'passwordConfirm': 'password mismatch'
      });
      return;
    }

    const promises = [];
    setLoading(true);
    setError('');

    if(email !== currentUser.email) {
      promises.push(updateEmail(email));
    }
    if(password) {
      promises.push(updatePassword(password));
    }

    Promise.all(promises)
      .then(() => {
        history.push('/');
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='my-page-root'>
      <div className='update-profile-wrapper'>
        <div className='title-wrapper'>
          <div className='title'>Update Profile</div>
        </div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className='input-field' id="email" name="email" label="email" 
          value={itemInput.email} onChange={onItemInputChange} errorText={errorText.email}/>
        <TextField className='input-field' id="password" name="password" label="Password" 
          type="password" value={itemInput.password} onChange={onItemInputChange} errorText={errorText.password} />
        <TextField className='input-field' id="passwordConfirm" name="passwordConfirm" label="Password" 
          type="password" value={itemInput.passwordConfirm} onChange={onItemInputChange} errorText={errorText.passwordConfirm} />
        <Button variant="contained" color="primary" onClick={onSignUp}>Update</ Button>
      </div>
      <div>
        Cancel <Link to='/'>Cancel</Link>
      </div>
    </div>
  );
};

export default SignUp;
