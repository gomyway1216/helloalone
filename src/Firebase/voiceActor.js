import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getVoiceActorList = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection')
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

export const getVoiceActorList3 = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection')
    .get().then(async (querySnapshot) => {
      const list = [];
      for(let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];
        const element = {
          id: doc.id,
          ...doc.data()
        };
        await getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
          .where('voice_actor_id', '==', doc.id).get().then((characterQuerySnapshot) => {
            const characterList = [];
            characterQuerySnapshot.forEach((characterDoc) => {
              const elem = {
                id: characterDoc.id,
                ...characterDoc.data()
              };
              characterList.push(elem);
            });
            element['characters'] = characterList;
          });
        list.push(element);
      }
      return list;
    });
};

export const getVoiceActorList4 = () => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection')
    .get().then(async (querySnapshot) => {
      const list = [];
      for(let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];
        const element = {
          id: doc.id,
          ...doc.data()
        };
        await getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
          .where('voice_actor_id', '==', doc.id).get().then(async (characterQuerySnapshot) => {
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
            element['characters'] = characterList;
          });
        list.push(element);
      }
      return list;
    });
};

export const getVoiceActor = (id) => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection').doc(id)
    .get().then((doc) => {
      return { id, ...doc.data() };
    });
};

// this is used when getting character list for a voice actor
export const getCharacterList = (voiceActorId) => {
  return getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('animeCharacterCollection')
    .where('voice_actor_id', '==', voiceActorId).get().then(async (characterQuerySnapshot) => {
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
    });
};

export const addVoiceActor = (userId, voiceActor) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }

  const currentTime = firebase.firestore.FieldValue.serverTimestamp();  
  const collectionRef = getDbAccess().collection(process.env.REACT_APP_DEFAULT_USER).doc('anime').collection('voiceActorCollection');
  if(voiceActor.docId) {
    return collectionRef.doc(voiceActor.docId).update({
      image: voiceActor.image,
      name_english: voiceActor.name_english,
      name_japanese: voiceActor.name_japanese,
      name_japanese_ruby: voiceActor.name_japanese_ruby,
      lastUpdated: currentTime
    });
  } else {
    voiceActor.created = currentTime;
    voiceActor.lastUpdated = currentTime;
    return collectionRef.add(voiceActor);
  }
};

export const getStorageRef = async (userId, file) => {
  if(userId !== process.env.REACT_APP_DEFAULT_USER) {
    throw new Error('Your account is not authorized for this action.');
  }

  const storageRef = fbConnect.exportStorageAccess().ref();
  const fileRef = storageRef.child('voice_actor/' + file.name);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return downloadURL;
};