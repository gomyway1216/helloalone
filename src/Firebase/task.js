import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as fbConnect from './firebaseConnect';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const createTask = (userId, task, docId) => {
  const currentTime = firebase.firestore.FieldValue.serverTimestamp();
  const collectionRef = getDbAccess().collection('users').doc(userId).collection('task');
  if(docId) {
    return collectionRef.doc(docId).update({
      title: task.title,
      status: task.status,
      priority: task.priority,
      obtain: task.obtain,
      pain: task.pain,
      fun: task.fun,
      happiness: task.happiness,
      findings: task.findings,
      breather: task.breather,
      updated: currentTime
    });
  } else {
    task.created = currentTime;
    task.updated = currentTime;
    return collectionRef.add(task);
  }
};

export const getTask = (userId, taskId) => {
  return getDbAccess().collection('users').doc(userId).collection('task').doc(taskId)
    .get().then(doc => {
      return { id: doc.id, value: doc.data()};
    });
};

export const getTasks = (userId) => {
  return getDbAccess().collection('users').doc(userId).collection('task')
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


// export const getTask = (userName, taskId) => {
//   return getDbAccess().collection(userName).doc('task').collection('taskCollection').doc(taskId)
//     .get().then(doc => {
//       return { id: doc.id, value: doc.data()};
//     });
// };

export const getDailyTask = async (userName) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const date1 = firebase.firestore.Timestamp.fromDate(today);
  const date2 = firebase.firestore.Timestamp.fromDate(tomorrow);
  const response = [];
  await getDbAccess().collection(userName).doc('task').collection('dailyCollection')
    .where('timestamp', '>=', date1).where('timestamp', '<=', date2)
    .get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        response.push({id: doc.id, value: doc.data()});
      });
    });
  return response[0];
};