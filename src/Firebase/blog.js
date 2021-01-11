import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
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

