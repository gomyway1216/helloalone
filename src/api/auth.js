import { getUser, setUser, removeUser } from '../storage/tokenService';
import api from './api';

// using axios
export const signUp = (username, email, password) => {
  return api.post('/auth/signup', {
    username,
    email,
    password
  });
};

export const signIn = (username, password) => {
  return api
    .post('/auth/signin', {
      username,
      password
    })
    .then((response) => {
      console.log('response for signIn', response);
      console.log('response.data for signIn', response.data);
      if (response.data.accessToken) {
        console.log('inside the if');
        setUser(response.data);
      }

      return response.data;
    });
};

export const signOut = () => {
  // localStorage.removeItem('user');
  removeUser();
};

export const getCurrentUser = () => {
  return getUser();
};