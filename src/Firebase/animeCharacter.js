import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const addAnimeCharacter = (userId, animeCharacter) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }

  const currentTime = firebase.firestore.FieldValue.serverTimestamp();
  const collectionRef = getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection');
  if(animeCharacter.docId) {
    return collectionRef.doc(animeCharacter.docId).update({
      image: animeCharacter.image,
      name_english: animeCharacter.name_english,
      name_japanese: animeCharacter.name_japanese,
      name_japanese_ruby: animeCharacter.name_japanese_ruby,
      lastUpdated: currentTime
    });
  } else {
    animeCharacter.created = currentTime;
    animeCharacter.lastUpdated = currentTime;
    return collectionRef.add(animeCharacter);
  }
};

export const getCharacterList = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
    .get().then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach(async (doc) => {
        const element = {
          id: doc.id,
          ...doc.data()
        };
        list.push(element);
      });
      return list;
    });
};

// provide the nested object of anime and voice actor details as well
export const getCharacterListDeep = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
    .get().then(async (characterQuerySnapshot) => {
      const characterList = [];
      for (let j = 0; j < characterQuerySnapshot.docs.length; j++) {
        const characterDoc = characterQuerySnapshot.docs[j];
        const anime = await getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('itemCollection').doc(characterDoc.data().anime_id)
          .get().then((doc) => {
            return { id: characterDoc.id, ...doc.data() };
          });
        const character = characterDoc.data();
        delete character.anime_id;
        character.anime = anime;
        const elem = {
          id: characterDoc.id,
          ...character
        };
        characterList.push(elem);
      }
      return characterList;
    }).then(async (characterList) => {
      for (let j = 0; j < characterList.length; j++) {
        const voiceActor = await getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection').doc(characterList[j].voice_actor_id)
          .get().then((doc) => {
            return { id: doc.id, ...doc.data() };
          });
        characterList[i].voiceActor = voiceActor;
        delete characterList[i].voice_actor_id;
      }
      return characterList;
    });
};

export const getStorageRef = async (userId, file) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }

  const storageRef = fbConnect.exportStorageAccess().ref();
  const fileRef = storageRef.child('character/' + file.name);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return downloadURL;
};