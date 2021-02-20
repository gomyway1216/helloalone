import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import ApplicationBar from './Component/ApplicationBar';
import { AuthProvider } from './Provider/AuthProvider';
import './App.css';

const App = () => {
  return (
    <BrowserRouter >
      <AuthProvider>
        <ApplicationBar />
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;