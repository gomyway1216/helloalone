import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './Provider/AuthProvider';
import PropTypes from 'prop-types';

const AdminRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props => (currentUser && 
        currentUser.uid === process.env.REACT_APP_DEFAULT_USER) ? <Component {...props} /> : <Redirect to="/invalid" />
      }
    ></Route>
  );
};

AdminRoute.propTypes = {
  component: PropTypes.func,
  rest: PropTypes.func
};

export default AdminRoute;