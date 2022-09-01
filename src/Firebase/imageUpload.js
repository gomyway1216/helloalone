import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getStorageRef = async (userId, file) => {
  const storageRef = fbConnect.exportStorageAccess().ref();
  const fileRef = storageRef.child('friend/' + userId + '/' + file.name);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return downloadURL;
};