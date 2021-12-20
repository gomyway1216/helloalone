import React, { useState, useEffect } from 'react';
import { getUserBoard } from '../../Api/user';
// import EventBus from "../common/EventBus";
import { useHistory } from 'react-router-dom';

const BoardUser = () => {
  const [content, setContent] = useState('');
  const history = useHistory();

  useEffect(() => {
    getUserBoard().then(
      (response) => {
        console.log('not error received in the UI');
        console.log('response.data!!', response.data);
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log('error received in the UI');
        // setContent(_content);
        setContent('value');
        // setContent(_content.message);
        if (error.response && error.response.status === 401) {
          // EventBus.dispatch("logout");
          console.log('error happening!!', error.response);
        } else {
          console.log('error for not 401!!', error.response);
          history.push('/testlogin');
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

export default BoardUser;
