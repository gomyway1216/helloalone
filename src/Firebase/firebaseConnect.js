import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

let db;

export const init = () => {
  firebase.initializeApp(firebaseConfig);
  if(!db) {
    db = firebase.firestore();
  }
};
init();

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const exportDbAccess = () => {
  return db;
};