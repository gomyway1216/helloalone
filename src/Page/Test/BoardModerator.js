import React, { useState, useEffect } from 'react';

import { getModeratorBoard } from '../../Api/user';
// import EventBus from './EventBus';

const BoardModerator = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    getModeratorBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          // EventBus.dispatch('logout');
          console.log('error happening!!', error.response);
        }
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardModerator;
