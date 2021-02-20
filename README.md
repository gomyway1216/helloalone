# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Firestore syntax
 The documents are stored in the combination of collection and document. Document contanins collection and collection contains document.
 So, to query data, it looks like this.
 ```javascript
   getDbAccess()
    .collection('yyaguchi')
    .doc('item')
    .collection('itemCollection')
    .doc('8X0zGquoMOL5EqCxXSXm')
    .get()
    .then((docRef) => { console.log(docRef.data()); });
 ```
 
 We can also use async await
 ```javascript
  const snapshot = await getDbAccess().collection('yyaguchi/item/itemCollection').doc('8X0zGquoMOL5EqCxXSXm').get();
  console.log(snapshot.data());
 ```

This is how to traverse collection item
```javascript
  getDbAccess().collection('yyaguchi/item/itemCollection').get()
  .then((array) => {
    array.docs.forEach((doc) => {
      console.log('each value');
      console.log(doc.data());
    });
  });
```

As you can see, the collection can be accessed in one shot as well. If the promise is not handled correctly, we would get some random object or data is not a function error.

# Use of Promise/Async function
Since this application requires API call to grab information, either using Promise, then block or async/await is required. This explains what could be a key for misunderstanding.
For the following function
```javascript
export const getItemById = async (userName, itemId) => {
  const val = await getDbAccess()
    .collection(userName)
    .doc('item')
    .collection('itemCollection')
    .doc(itemId)
    .get()
    .then((docRef) => {
      console.log('docRef.data()', docRef.data());
      return docRef.data();});
  console.log('val in getItemById', val);
  return val;
}; 
```
both docRef.data() and val in getItemById would print the actual value, because await stops until getting the result. However, the returned value is Promise.
The misunderstanding here is that await returns the actual value. This is only true inside of this async function. Any function that calls this function doesn't wait the promise to be resolved. So, the parent function would receive Promise even though we do await here. If we want to make the parent function to wait for the result, we need to put await to the call to this function. However, it is not possible in the following case.
```javascript
useEffect(() => {
  const val = getItemById();
  console.log('val', val);
})
```
Above will print out promise instead of the actual value. If we put await in from of getItemById() call,
we would get the following error
```
Argument of type '() => Promise<void>' is not assignable to parameter of type 'EffectCallback'.
```
This article explains more about it.
https://medium.com/javascript-in-plain-english/how-to-use-async-function-in-react-hook-useeffect-typescript-js-6204a788a435

For the solution, the article uses
```javascript
  useEffect(() => {
    // Create an scoped async function in the hook
    async function anyNameFunction() {
      await loadContent();
    }
    // Execute the created function directly
    anyNameFunction();
  }, []);
```
which is identical to my usecase where we have the external async function and uses await to the function.
This means, there is no way for use to get the function to return the value in useEffect.
This also explains why async function returns promise when using await.
https://stackoverflow.com/questions/43422932/async-await-always-returns-promise

The goal here is to grab the information somehow. For this, we need to pass callback like following. 
```javascript
  useEffect(() => {
    console.log('useEffect call');
    blogApi.streamItemList(rankingConstants.USER_NAME, 'animeRanking', {
      next: querySnapshot => {
        setLoading(true);
        const updateItems = querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        setItemList(updateItems);
      },
      error: () => {
        setLoading(false);
        console.log('error');
      }
    });
  }, [rankingCount]);
```
and set the value by calling the setItemList in the callback.
the api function used by the above looks like following.
```javascript
export const streamItemList = (userName, itemName, observer) => {
  return getDbAccess().collection(userName)
    .doc('ranking')
    .collection(itemName)
    .onSnapshot(observer);
};
```

Regarding this, there are two ways to grab record, one is using get(), which is to get the record once,
the other way is to use onSnapshot to listen to the changes. This article explains more about it.
https://stackoverflow.com/questions/54479892/difference-between-get-and-onsnapshot-in-cloud-firestore/54480212
onSnapshot is more expensive.

# Shallow copy vs Deep copy
```javascript
const assign = array // Changes to array will change copyWithEquals
console.log(assign === array) // true (The assignment operator did not make a copy)

const copySpread = [...array] // Changes to array will not change copyWithSpread
console.log(copySpread === array) // false (The spread operator made a shallow copy)
```
more about the above https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
using === could tell more about this
```javascript
const nestedList = [['a'], ['b'], ['c']]
const nestedListSpread = [...nestedList]
console.log(nestedList[0] === nestedListSpread[0]) // true -- Shallow copy (same reference)
```
One of the solution, use lodash
```javascript
const deepCopyLodash = _.cloneDeep(nestedArray)
console.log(nestedArray[0] === deepCopyLodash[0]) // false -- Deep copy (different reference)
```

# When console.log to debug
Use JSON.stringify otherwise the console log would be confusing.
