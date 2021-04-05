import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const checkChatGroupAccess = (id, chatPassword) => {
  return getDbAccess().collection('chat').doc(id).get()
    .then(doc => {
      if(!doc.exists) {
        console.log('doc does not exist docId: ', id);
        return false;
      } else {
        const isPasswordRequired = doc.data().isPasswordRequired;
        if(!isPasswordRequired) {
          return true;
        } else {
          return doc.data().password === chatPassword;
        }
      }
    });
};

export const getChatGroupList = () => {
  return getDbAccess().collection('chat').get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach(doc => {
        const element = {
          id: doc.id,
          value: doc.data()
        };
        list.push(element);
      });
      return list;
    });
};

export const createChat = (chatGroupId, chatPassword, uid, content) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  checkChatGroupAccess(chatGroupId, chatPassword)
    .then(accessEnabled => {
      if(!accessEnabled) {
        return new Error('password is wrong');
      } else {
        return getDbAccess().collection('chat').doc(chatGroupId)
          .collection('chat').add({
            content,
            timestamp,
            uid
          });
      }
    });
  return getDbAccess().collection('chat').doc();
};

let lastQuery;

export const getLastQuery = (id, pageSize) => {
  lastQuery = getDbAccess().collection('chat').doc(id)
    .collection('chat').orderBy('timestamp', 'desc').limit(pageSize);
  return lastQuery;
};

export const getOlderChats = (id, chatPassword, lastDocId, pageSize, callback) => {
  if(!lastQuery) {
    getLastQuery(id, pageSize);
  }
  const lastRef = lastQuery;

  checkChatGroupAccess(id, chatPassword)
    .then(accessEnabled => {
      if(!accessEnabled) {
        throw new Error('password is wrong or missing');
      } else if (!lastDocId) {
        throw new Error('lastDocId is missing');
      } else {
        return getDbAccess().collection('chat').doc(id).collection('chat')
          .doc(lastDocId).get().then(doc => {
            if(!doc.exists) {
              return;
            }
            return getDbAccess().collection('chat').doc(id)
              .collection('chat').orderBy('timestamp', 'desc').startAfter(doc).limit(pageSize)
              .get().then(callback);
          });
      }
    });
};

export const streamChats = (id, chatPassword, pageSize, observer, pageNumber) => {
  checkChatGroupAccess(id, chatPassword)
    .then(accessEnabled => {
      if(!accessEnabled) {
        return 'password is wrong';
      } else {
        return getDbAccess().collection('chat').doc(id)
          .collection('chat').orderBy('timestamp', 'desc').limit(pageSize)
          .onSnapshot(observer);
      }
    });
};

export const createChatGroup = (name, isPasswordRequired, password, description) => {
  return getDbAccess().collection('chat').add({
    name,
    isPasswordRequired,
    password,
    description
  });
};

export const checkPasswordRequired = async (id) => {
  const doc = await getDbAccess().collection('chat').doc(id).get();
  console.log(doc.data());
  return doc.data().isPasswordRequired;
};