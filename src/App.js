import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import ApplicationBar from './Component/ApplicationBar';


const App = () => {
  return (
    <BrowserRouter >
      <ApplicationBar />
      <Routes />
    </BrowserRouter>
  );
};

export default App;

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/8.1.2/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="/__/firebase/8.1.2/firebase-analytics.js"></script>

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>