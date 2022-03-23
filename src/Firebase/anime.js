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
      name_english: item.name_english,
      name_japanese: item.name_japanese,
      name_japanese_ruby: item.name_japanese_ruby,
      mainImage: item.mainImage,
      description: item.description,
      tags: item.tags,
      score: item.score,
      lastUpdated: currentTime
    });
  } else {
    item.created = currentTime;
    item.lastUpdated = currentTime;
    return collectionRef.add(item);
  }
};

export const addTag = (userId, item) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }
  const collectionRef = getDbAccess().collection(userId).doc('anime').collection('tagCollection');
  return collectionRef.add(item);
};

export const getTagList = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('tagCollection')
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


// this is used when getting character list for an anime
export const getCharacterList = (animeId) => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
    .where('anime_id', '==', animeId).get().then(async (characterQuerySnapshot) => {
      const characterList = [];
      for (let j = 0; j < characterQuerySnapshot.docs.length; j++) {
        const characterDoc = characterQuerySnapshot.docs[j];
        const voiceActor = await getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection').doc(characterDoc.data().voice_actor_id)
          .get().then((doc) => {
            return { id: characterDoc.id, ...doc.data() };
          });
        const character = characterDoc.data();
        delete character.voice_actor_id;
        character.voice_actor = voiceActor;
        const elem = {
          id: characterDoc.id,
          ...character
        };
        characterList.push(elem);
      }
      return characterList;
    });
};