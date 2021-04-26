import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';
import 'firebase/storage';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getAccumulation = () => {
  return getDbAccess().collection('projects').doc('prediction-project')
    .collection('accumulation').get()
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

export const incrementAccumulation = (choices, isCorrect, callback) => {
  const collectionRef = getDbAccess().collection('projects').doc('prediction-project')
    .collection('accumulation').get();
  return collectionRef
    .then(querySnapshot => querySnapshot.docs)
    .then(items => items.find(elem => elem.data().choices === parseInt(choices)))
    .then(matchedItem => {
      if(!matchedItem) {
        throw new Error('the item does not exist');
      }

      const id = matchedItem.id;
      let currentTotalCount = matchedItem.data().totalCount;
      let currentCorrectCount = matchedItem.data().correctCount;
      if(isCorrect) {
        currentCorrectCount += 1;
      }
      currentTotalCount += 1;
      getDbAccess().collection('projects').doc('prediction-project')
        .collection('accumulation').doc(id)
        .update({
          totalCount: currentTotalCount,
          correctCount: currentCorrectCount
        })
        .then(val => {
          callback();
        });
    });
};