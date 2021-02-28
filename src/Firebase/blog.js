import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

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

export const addBlog = (userName, value) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  value.timestamp = timestamp;
  return getDbAccess().collection(userName).doc('blog').collection('blogCollection')
    .add(value);
};

export const getBlogList = (userName) => {
  return getDbAccess().collection(userName).doc('blog').collection('blogCollection')
    .get().then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const element = {
          id: doc.id,
          value: doc.data()
        };
        list.push(element);
      });
      return list;
    });
};

export const getBlog = (userName, id) => {
  return getDbAccess().collection(userName).doc('blog').collection('blogCollection').doc(id)
    .get().then(doc => {
      return doc.data();
    });
};

export const addItem = (userName, item) => {
  const collectionRef = getDbAccess().collection(userName).doc('item').collection('itemCollection').get();
  return collectionRef
    .then(querySnapshot => querySnapshot.docs)
    .then(items => items.find(elem => elem.data().name.toLowerCase() === item.name.toLowerCase()))
    .then(matchedItem => {
      if(!matchedItem) {
        return getDbAccess().collection(userName)
          .doc('item')
          .collection('itemCollection')
          .add({
            name: item.name,
            description: item.description,
            short: item.short,
            tags: item.tags
          })
          .then(docRef => docRef.id);
      } else { 
        throw new Error('the adding item exists');
      }
    });
};

export const updateItem = (userName, item) => {
  return getDbAccess().collection(userName).doc('item').collection('itemCollection')
    .doc(item.id).update({
      name: item.name,
      description: item.description,
      short: item.short,
      tags: item.tags
    });
};

export const deleteItem = (userName, id, callback) => {
  getDbAccess().collection(userName).doc('item').collection('itemCollection')
    .doc(id).delete();

  getDbAccess().collection(userName).doc('ranking').get().then(
    doc => {
      if(!doc.exists) {
        console.log('the document in the map doesn\'t exist');
      } else {
        const rankingMap = doc.data().rankingMap;
        Object.keys(rankingMap).map(key => {
          getDbAccess().collection(userName).doc('ranking').collection(key)
            .where('itemList', 'array-contains', id).get().then(
              (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  const docRef = getDbAccess().collection(userName).doc('ranking').collection(key).doc(doc.id);
                  docRef.update({
                    itemList: firebase.firestore.FieldValue.arrayRemove(id)
                  }).then(callback());
                });
              }
            );
        });
      }
    }
  );
};

export const streamRankingItemList = (userName, itemName, observer) => {
  return getDbAccess().collection(userName)
    .doc('ranking')
    .collection(itemName)
    .onSnapshot(observer);
};

export const getItemById = async (userName, itemId) => {
  return getDbAccess()
    .collection(userName)
    .doc('item')
    .collection('itemCollection')
    .doc(itemId)
    .get()
    .then((docRef) => {
      let composite = {id: docRef.id, ...docRef.data()};
      return composite;}); 
};

export const updateItemListBatch = (userName, itemName, batchItemList, setLoading) => {
  const updateCollectionRef = getDbAccess().collection(userName).doc('ranking').collection(itemName);
  const batch = getDbAccess().batch();
  batchItemList.forEach(batchItem => {
    const itemOriginalList = [];
    batchItem.itemList.forEach(item => itemOriginalList.push(item.id));
    batch.update(updateCollectionRef.doc(batchItem.id), {itemList: itemOriginalList, rank: batchItem.rank});
  });
  batch.commit();
  // below will display the render in the middle, for now, make it loading,
  // until database returns the actual value by realtime update
  // batch.commit().then(() => setLoading(false));
};

export const createRankingItem = (userName, itemName, rank) => {
  getDbAccess().collection(userName).doc('ranking').collection(itemName)
    .add({
      rank,
      itemList: []
    });
};

export const deleteRankingItem = (userName, itemName, rankingItemId) => {
  getDbAccess().collection(userName).doc('ranking').collection(itemName)
    .doc(rankingItemId).delete();
};

export const streamRankingList = (userName, observer) => {
  getDbAccess().collection(userName).doc('ranking')
    .onSnapshot(observer);
};

export const addItemToRanking = (userName, itemName, rankingItemId, itemId) => {
  const docRef = getDbAccess().collection(userName).doc('ranking').collection(itemName)
    .doc(rankingItemId);
  return docRef.update({
    itemList: firebase.firestore.FieldValue.arrayUnion(itemId)
  });
};

export const deleteItemFromRanking = (userName, itemName, rankingItemId, itemId) => {
  const docRef = getDbAccess().collection(userName).doc('ranking').collection(itemName)
    .doc(rankingItemId);
  return docRef.update({
    itemList: firebase.firestore.FieldValue.arrayRemove(itemId)
  });
};

export const streamItemList = (userName, itemName, observer)=> {
  return getDbAccess().collection(userName).doc('item').collection(itemName)
    .onSnapshot(observer);
};

export const streamTags = (userName, observer)=> {
  return getDbAccess().collection(userName).doc('tag').collection('tagCollection')
    .onSnapshot(observer);
};

export const createRanking = async (userName, itemName) => {
  const docRef = getDbAccess().collection(userName).doc('ranking');
  await docRef.get().then(
    doc => {
      if(!doc.exists) {
        console.log('the document in the map doesn\'t exist');
      } else {
        const rankingMap = doc.data().rankingMap;
        rankingMap[itemName] = itemName;
        docRef.update({
          rankingMap: rankingMap
        });
      }
    }
  );

  return getDbAccess().collection(userName).doc('ranking').collection(itemName)
    .add({
      itemList: [],
      rank: 1
    });

};

export const updateRankingTitle = async (userName, ranking) => {
  const docRef = getDbAccess().collection(userName).doc('ranking');
  let rankingMap = null;
  await docRef.get().then(
    doc => {
      if(!doc.exists) {
        console.log('the document in the map doesn\'t exist');
      } else {
        rankingMap = doc.data().rankingMap;
      }
    }
  );

  if(rankingMap) {
    rankingMap[ranking.id] = ranking.name;
    return docRef.update({
      rankingMap: rankingMap
    });
  } else {
    return new Promise();
  }
};

export const deleteRanking = (userName, rankingId) => {
  const docRef = getDbAccess().collection(userName).doc('ranking');
  docRef.collection(rankingId)
    .get().then(
      res => {
        res.forEach(element => {
          element.ref.delete();
        });
      }
    );
  docRef.get()
    .then(
      doc => {
        const rankingMap = doc.data().rankingMap;
        if(rankingMap) {
          delete rankingMap[rankingId];
          docRef.update({
            rankingMap: rankingMap
          });
        } 
      }
    );
};

export const getStorageRef = async (file) => {
  const storageRef = fbConnect.exportStorageAccess().ref();
  const fileRef = storageRef.child(file.name);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return downloadURL;
};