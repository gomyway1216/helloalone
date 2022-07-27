import { getAuthHeader } from '../util/util';

export const doFetch = (sub, requestBody) => {
  const backendApi = process.env.REACT_APP_BACKEND_API + sub;
  return fetch(backendApi, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    console.log('doFetch res: ', res);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed fetching signed data');
    }
    return res.json();
  });
};

export const doGet = sub => {
  const backendApi = process.env.REACT_APP_BACKEND_API + sub;
  console.log('backendApi', backendApi);
  return fetch(backendApi, {
    method: 'GET',
    headers: getAuthHeader()
  }).then(res => {
    console.log('doGet res', res);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed fetching signed data');
    }
    let jsonVal;
    try {
      jsonVal = res.json();
      console.log('jsonVal', jsonVal);
      console.log('no error');
    } catch(e) {
      console.log(e);
    }
    // const jsonVal = res.json();
    // return res.json();
    return jsonVal;
  });
};