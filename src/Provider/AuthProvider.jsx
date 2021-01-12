import React, { useState, createContext } from 'react';
import * as blogApi from '../Firebase/blog';
import PropTypes from 'prop-types';

const defaultLoginInfo = {
  token: null,
  user: null
};

export const AuthContext = createContext(defaultLoginInfo);

export const AuthProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState(
    JSON.parse(localStorage.getItem('loginInfo')) || defaultLoginInfo
  );

  const login = async () => {
    const userInfo = await blogApi.authenticateUser();
    const token = userInfo[0];
    const user = userInfo[1];
    localStorage.setItem(
      'loginInfo',
      JSON.stringify({ token, user })
    );
    setLoginInfo({
      token,
      user,
    });
  };

  const logout = () => {
    setLoginInfo(defaultLoginInfo);
    localStorage.removeItem('loginInfo');
  };

  const { token, user } = loginInfo;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object
};