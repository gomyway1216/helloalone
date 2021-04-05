import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

const Home = ({ history }) => {
  return (
    <div>
      <h1>This is Home!</h1>
      <Button color="primary" onClick={() => history.push('/create')}>Create Blog</Button>
      <Button color="primary" onClick={() => history.push('/blog')}>Blog</Button>
    </div>
  );
};

export default Home;

Home.propTypes = {
  history: PropTypes.object
};