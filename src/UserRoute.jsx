import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUser } from './storage/tokenService';

const UserRoute = (props) => {
  const { component: Component, ...rest } = props;
  const user = getUser();

  return (
    <Route
      {...rest}
      render={props => {
        return user ? <Component {...props} /> : <Redirect to='/user-signin' />;
      }}
    ></Route>
  );
};

export default UserRoute;

UserRoute.propTypes = {
  component: PropTypes.func,
  rest: PropTypes.func
};
