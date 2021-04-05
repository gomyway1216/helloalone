import React from 'react';
import { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './Provider/AuthProvider';
import PropTypes from 'prop-types';

const PrivateRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to='/signin' />;
      }}
    ></Route>
  );
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.func,
  rest: PropTypes.func
};