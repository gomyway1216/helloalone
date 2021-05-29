import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getAnimeItemList = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('itemCollection')
    .get().then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const element = {
          id: doc.id,
          ...doc.data()
        };
        list.push(element);
      });
      return list;
    });
};

export const getStorageRef = async (userId, file) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }

  const storageRef = fbConnect.exportStorageAccess().ref();
  const fileRef = storageRef.child('anime/' + file.name);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return downloadURL;
};

export const addItem = (userId, item) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }
  const currentTime = firebase.firestore.FieldValue.serverTimestamp();  
  const collectionRef = getDbAccess().collection(item.user).doc('anime').collection('itemCollection');
  // if the adding item exists, update the item
  if(item.docId) {
    return collectionRef.doc(item.docId).update({
      name: item.name,
      mainImage: item.mainImage,
      description: item.description,
      score: item.score,
      lastUpdated: currentTime
    });
  } else {
    item.created = currentTime;
    item.lastUpdated = currentTime;
    return collectionRef.add(item);
  }
};