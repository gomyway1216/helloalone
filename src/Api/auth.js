// import axios from 'axios';
import { doFetch } from './doFetch';
import { getUser, setUser, removeUser } from '../Storage/tokenService';
import api from './api';

const API_URL = 'http://localhost:8080/api/auth/';

// const register = (username, email, password) => {
//   return axios.post(API_URL + "signup", {
//     username,
//     email,
//     password,
//   });
// };

// using doFetch
// export const signUp = (username, email, password) => {
//   console.log('username, email, password', username, email, password);
//   return doFetch('auth/signup', {
//     username,
//     email,
//     password
//   });
// };

// using axios
export const signUp = (username, email, password) => {
  return api.post('/auth/signup', {
    username,
    email,
    password
  });
};


// const login = (username, password) => {
//   return axios
//     .post(API_URL + 'signin', {
//       username,
//       password,
//     })
//     .then((response) => {
//       if (response.data.accessToken) {
//         localStorage.setItem('user', JSON.stringify(response.data));
//       }

//       return response.data;
//     });
// };

// using doFetch
// export const signIn = (username, password) => {
//   console.log('username, password', username, password);
//   return doFetch('auth/signin', {
//     username,
//     password
//   }).then((res) => {
//     console.log('response~~~~~', res);
//     if(res.accessToken) {
//       console.log('inside the if');
//       // setUser(response);
//       console.log('setUser is called');
//       console.log(JSON.stringify(res));
//       localStorage.setItem('user', JSON.stringify(res));
//     }
//     console.log('res 2', res);
//     return res;
//   });
// };


export const signIn = (username, password) => {
  return api
    .post('/auth/signin', {
      username,
      password
    })
    .then((response) => {
      console.log('response~~~~~', response);
      console.log('response.data~~~~~', response.data);
      if (response.data.accessToken) {
        console.log('inside the if');
        setUser(response.data);
      }

      return response.data;
    });
};


// const logout = () => {
//   localStorage.removeItem('user');
// };

export const logOut = () => {
  // localStorage.removeItem('user');
  removeUser();
};

export const getCurrentUser = () => {
  return getUser();
};
