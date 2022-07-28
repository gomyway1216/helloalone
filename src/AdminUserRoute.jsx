import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUser } from './storage/tokenService';

const AdminUserRoute = (props) => {
  const { component: Component, ...rest } = props;
  const user = getUser();
  console.log('user', user);
  if(!user || !user.admin) {
    return <Redirect to='/user-signin' />;
  }

  return (
    <Route
      {...rest}
      render={props => {
        return user ? <Component {...props} /> : <Redirect to='/user-signin' />;
      }}
    ></Route>
  );
};

export default AdminUserRoute;

AdminUserRoute.propTypes = {
  component: PropTypes.func,
  rest: PropTypes.func
};
