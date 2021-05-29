import React from 'react';
import { Link } from 'react-router-dom';

const InvalidPage = () => {
  return (
    <div>
      This page is not accessible
      <Link to='/'>Home</Link>
    </div>
  );
};

export default InvalidPage;