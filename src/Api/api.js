import axios from 'axios';
import { getLocalAccessToken, getLocalRefreshToken, updateLocalAccessToken } from '../Storage/tokenService';
// import TokenService from './token.service';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      console.log('token: ' + token);
      console.log('refreshToken : {}', getLocalRefreshToken());
      config.headers['Authorization'] = 'Bearer ' + token; // for Spring Boot back-end
      // config.headers['x-access-token'] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    console.log('no error', res);
    return res;
  },
  async (err) => {
    console.log('error obj', err);
    const originalConfig = err.config;
    console.log('error??', originalConfig);
    console.log('err.response ?', err.response);
    if (originalConfig.url !== '/auth/signin' && err.response) {
      // Access Token was expired
      console.log('the response is not returned');
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        console.log('accessing to refreshtoken');
        try {
          const rs = await instance.post('/auth/refreshtoken', {
            refreshToken: getLocalRefreshToken(),
          });
          console.log('/auth/refreshtoken response', rs);
          const { accessToken } = rs.data;
          updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      } else {
        console.log('error not 401', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;