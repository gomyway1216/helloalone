// import axios from 'axios';
// import { getAuthHeader } from '../util/util';
import { doFetch, doGet } from './doFetch';
import api from './api';

const API_URL = 'http://localhost:8080/api/test/';

// const getPublicContent = () => {
//   return axios.get(API_URL + "all");
// };

// export const getPublicContent = () => {
//   console.log('getPublicContent');
//   // return doGet('test/all');
//   return doGet('test/all').then(res => {
//     console.log('hello');
//     console.log('test/all', res);
//     return res;
//   });
// };

export const getPublicContent = () => {
  return api.get('/test/all');
};

// const getUserBoard = () => {
//   return axios.get(API_URL + 'user', { headers: authHeader() });
// };

// export const getUserBoard = () => {
//   return doGet('test/user');
// };

export const getUserBoard = () => {
  return api.get('/test/user');
};

// const getModeratorBoard = () => {
//   return axios.get(API_URL + 'mod', { headers: authHeader() });
// };



// export const getModeratorBoard = () => {
//   return doGet('test/mod');
// };

export const getModeratorBoard = () => {
  return api.get('/test/mod');
};

// const getAdminBoard = () => {
//   return axios.get(API_URL + 'admin', { headers: authHeader() });
// };

// export const getAdminBoard = () => {
//   console.log('getAdminBoard triggered', getAdminBoard);
//   return doGet('test/admin').then(res => {
//     console.log('hello');
//     console.log('test/admin', res);
//     return res;
//   });
// };

export const getAdminBoard = () => {
  return api.get('/test/admin');
};

// export default {
//   getPublicContent,
//   getUserBoard,
//   getModeratorBoard,
//   getAdminBoard,
// };
