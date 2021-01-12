import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const authenticateUser = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  return firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      return [token, user];
    }).catch((error) => {
    // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.log('error in user login', errorCode, errorMessage);
    });
};

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const addBlog = (value) => {
  return getDbAccess().collection('blog').doc(value.title).set(value);
};

export const getBlogListId = () => {
  return getDbAccess().collection('blog').get().then((querySnapshot) => {
    const list = [];
    querySnapshot.forEach((doc) => {
      const element = {
        id: doc.id,
        value: doc.data().body
      };
      list.push(element);
    });
    return list;
  });
};

export const addItem = (userName, itemName, item) => {
  return getItemList(userName, itemName)
    .then(querySnapshot => querySnapshot.docs)
    .then(items => items.find(elem => elem.data().title.toLowerCase() === item.title.toLowerCase()))
    .then(matchedItem => {
      if(!matchedItem) {
        return getDbAccess().collection(userName)
          .doc(itemName)
          .collection(itemName + 'List')
          .add({
            title: item.title,
            description: item.description,
            short: item.short,
            category: item.category,
            order: item.order
          })
          .then(docRef => docRef.id);
      } else { 
        throw new Error('the adding item exists');
      }
    });
};

export const updateItem = (userName, itemName, item) => {
  return getDbAccess().collection(userName).doc(itemName).collection(itemName + 'List')
    .doc(item.id).update({
      title: item.title,
      description: item.description,
      short: item.short,
      category: item.category,
      order: item.order
    });
};

export const setRankingCount = (userName, itemName, count) => {
  return getDbAccess().collection(userName).doc(itemName).set({rankingCount: count}, {merge: true});
};

export const deleteItem = (userName, itemName, id) => {
  return getDbAccess().collection(userName).doc(itemName).collection(itemName + 'List')
    .doc(id).delete();
};

export const getItemList = (userName, itemName) => {
  return getDbAccess().collection(userName)
    .doc(itemName)
    .collection(itemName + 'List')
    .get();
};

export const streamItemList = (userName, itemName, observer) => {
  return getDbAccess().collection(userName)
    .doc(itemName)
    .collection(itemName + 'List')
    .onSnapshot(observer);
};

export const streamRankCount = (userName, itemName, observer) => {
  return getDbAccess().collection(userName)
    .doc(itemName)
    .onSnapshot(observer);
};

export const batchAccess = (userName, itemName, batchItemList, setLoading) => {
  const updateCollectionRef = getDbAccess().collection(userName).doc(itemName).collection(itemName + 'List');
  const batch = getDbAccess().batch();
  batchItemList.forEach(batchItem => {
    batch.update(updateCollectionRef.doc(batchItem.id), batchItem);
  });
  batch.commit().then(() => setLoading(false));
};
