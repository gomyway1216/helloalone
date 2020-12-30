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

const createListName = (itemName) => {
  const val = 'categorized' + itemName.charAt(0).toUpperCase() + itemName.slice(1) + 'List';
  console.log('val in createListName: {}', val);
  return val;
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

export const addAnimeItem = (item) => {
  return getAnimeList()
    .then(querySnapshot => querySnapshot.docs)
    .then(animeItems => animeItems.find(animeItem => animeItem.data().title.toLowerCase() === item.title.toLowerCase()))
    .then(matchingItem => {
      if(!matchingItem) {
        return getDbAccess().collection('anime')
          .doc('animeList')
          .collection('items')
          .add({
            title: item.title,
            description: item.description,
            short: item.short
          })
          .then(docRef => docRef.id);
      } else { 
        return matchingItem.update({
          title: item.title,
          description: item.description,
          short: item.short
        });
      }
    });
};

export const addCategorizedAnimeItem = (category, item) => {
  return getCategorizedAnimeList(category)
    .then(querySnapshot => querySnapshot.docs)
    .then(animeItems => animeItems.find(animeItem => animeItem.data().title.toLowerCase() === item.title.toLowerCase()))
    .then(matchingItem => {
      if(!matchingItem) {
        return getDbAccess().collection('anime')
          .doc('categorizedAnimeList')
          .collection(category)
          .add({
            originalId: item.originalId,
            title: item.title,
            description: item.description,
            short: item.short
          });
      } else { 
        return matchingItem.update({
          title: item.title,
          description: item.description,
          short: item.short
        });
      }
    });
};

export const addCategorizedItem = (itemName, category, item) => {
  return getCategorizedItemList(itemName, category)
    .then(querySnapshot => querySnapshot.docs)
    .then(items => items.find(element => element.data().title.toLowerCase() === item.title.toLowerCase()))
    .then(matchingItem => {
      if(!matchingItem) {
        return getDbAccess().collection(itemName)
          .doc(createListName(itemName))
          .collection(category)
          .add({
            title: item.title,
            description: item.description,
            short: item.short
          });
      } else { 
        return matchingItem.update({
          title: item.title,
          description: item.description,
          short: item.short
        });
      }
    });
};

export const updateAnimeItem = (item) => {
  return getDbAccess().collection('anime').doc('animeList').collection('items')
    .doc(item.id).update({
      title: item.title,
      description: item.description,
      short: item.short
    });
};

export const updateCategorizedAnimeItem = (category, item) => {
  return getDbAccess().collection('anime').doc('categorizedAnimeList').collection(category)
    .doc(item.id).update({
      title: item.title,
      description: item.description,
      short: item.short
    });
};

export const updateCategorizedItem = (itemName, category, item) => {
  return getDbAccess().collection(itemName).doc(createListName(itemName)).collection(category)
    .doc(item.id).update({
      title: item.title,
      description: item.description,
      short: item.short
    });
};

export const deletedAnimeItem = (id) => {
  return getDbAccess().collection('anime').doc('animeList').collection('items')
    .doc(id).delete();
};

export const deleteCategorizedAnimeItem = (category, id) => {
  return getDbAccess().collection('anime').doc('categorizedAnimeList').collection(category)
    .doc(id).delete();
};

export const deleteCategorizedItem = (itemName, category, id) => {
  return getDbAccess().collection(itemName).doc(createListName(itemName)).collection(category)
    .doc(id).delete();
};

export const getAnimeList = () => {
  return getDbAccess().collection('anime')
    .doc('animeList')
    .collection('items')
    .get();
};

export const getCategorizedAnimeList = (category) => {
  return getDbAccess().collection('anime')
    .doc('categorizedAnimeList')
    .collection(category)
    .get();
};

export const getCategorizedItemList = (itemName, category) => {
  return getDbAccess().collection(itemName)
    .doc(createListName(itemName))
    .collection(category)
    .get();
};

export const streamAnimeList = (observer) => {
  return getDbAccess().collection('anime')
    .doc('animeList')
    .collection('items')
    .onSnapshot(observer);
};

export const streamCategorizedAnimeList = (category, observer) => {
  return getDbAccess().collection('anime')
    .doc('categorizedAnimeList')
    .collection(category)
    .onSnapshot(observer);
};

export const streamCategorizedItemList = (itemName, category, observer) => {
  return getDbAccess().collection(itemName)
    .doc(createListName(itemName))
    .collection(category)
    .onSnapshot(observer);
};
