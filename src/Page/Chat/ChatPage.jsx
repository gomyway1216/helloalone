import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../Provider/AuthProvider';
import * as chatApi from '../../Firebase/chat';
import { useParams } from 'react-router-dom';
import * as util from '../../util/util';
import { useInView } from 'react-intersection-observer';
import { CircularProgress } from '@material-ui/core';
import './chatPage.scss';

const Chat = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [content, setContent] = useState('');
  const [writeError, setWriteError] = useState();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('12345');
  const [viewChangeCounter, setViewChangeCounter] = useState(0);
  const topRef2 = useRef();
  const bottomRef2 = useRef();
  const PAGE_SIZE = 10;
  const [oldMessageSize, setOldMessageSize] = useState(PAGE_SIZE);
  const stateRef = useRef();
  stateRef.current = chats;

  const { ref: topRef, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const { ref: bottomRef, inView: bottomInView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const bottomViewRef = useRef();
  bottomViewRef.current = bottomInView;

  useEffect(() => {  
    chatApi.streamChats(id, password, PAGE_SIZE, {
      next: querySnapshot => {
        let isMessageFromOwn = false;
        // an array of only new messages
        const newArray = [];
        setLoading(true);
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMessage = {id: change.doc.id, ...change.doc.data()};
            newArray.push(newMessage);
            if(newMessage.uid === currentUser.uid) {
              isMessageFromOwn = true;
            }
          }
          if (change.type === 'modified') {
            const newMessage = {id: change.doc.id, ...change.doc.data()};
            const index = util.getObjectIndexById(stateRef.current, newMessage);
            if(index >= 0) {
              stateRef.current[index] = newMessage;
            }
            if(newMessage.uid === currentUser.uid) {
              isMessageFromOwn = true;
            }
          }
        });  
        newArray.reverse();
        setChats([...stateRef.current, ...newArray]);
        // scroll down if the new message is sent by this client or if the latest message is in screen
        if(bottomRef2 && bottomRef2.current && (isMessageFromOwn || bottomViewRef.current)) {
          bottomRef2.current.scrollIntoView();
        }
        setLoading(false);
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWriteError(null);
    try {
      chatApi.createChat(id, password, currentUser.uid, content);
      setContent('');
    } catch (error) {
      setWriteError(error.message);
    }
  };

  const handleChatContentChange = (event) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    setViewChangeCounter(viewChangeCounter+1);
    if(inView && chats.length !== 0 && viewChangeCounter >= 2) {
      setLoading(true);
      const lastDocId = chats[0].id;
      chatApi.getOlderChats(id, password, lastDocId, PAGE_SIZE,
        querySnapshot => {
          const list = querySnapshot.docs.map(docSnapshot => (
            {id: docSnapshot.id, ...docSnapshot.data()}
          ));  
          if(list.length < PAGE_SIZE) {
            setOldMessageSize(list.length);
          }
          list.reverse();
          const newNewArray = [...list, ...chats];
          if(newNewArray.length < 1) {
            console.log('setting array is empty');
          } else {
            setChats(newNewArray);
            if(topRef2 && topRef2.current) {
              topRef2.current.scrollIntoView();
            }
          }
          setLoading(false);     
        }        
      ); 
    }
  }, [inView]);

  return(
    <div>
      <div className="chat-area">
        <div ref={topRef}></div>
        <div className="loading-icon">
          {loading && <CircularProgress />}
        </div>     
        {chats.length > oldMessageSize && chats.slice(0, oldMessageSize).map(chat =>
          <p key={chat.id} className={'chat-bubble ' + (currentUser.uid === chat.uid ? 'current-user' : '')}>
            {chat.content}
            <br />
            <span className="chat-time float-right">{chat.timestamp ? util.formatDateWithMinutes(chat.timestamp.seconds) : 'now'}</span>
          </p>
        )}    
        <div ref={topRef2}></div>
        {chats.slice(chats.length > oldMessageSize ? oldMessageSize : 0, chats.length-1).map(chat =>
          <p key={chat.id} className={'chat-bubble ' + (currentUser.uid === chat.uid ? 'current-user' : '')}>
            {chat.content}
            <br />
            <span className="chat-time float-right">{chat.timestamp ? util.formatDateWithMinutes(chat.timestamp.seconds) : 'now'}</span>
          </p>
        )}
        <div ref={bottomRef}></div>
        <div ref={bottomRef2}></div>
        {chats && chats.length > 0 &&
          <p key={chats[chats.length-1].id} className={'chat-bubble ' + (currentUser.uid === chats[chats.length-1].uid ? 'current-user' : '')}>
            {chats[chats.length-1].content}
            <br />
            <span className="chat-time float-right">{chats[chats.length-1].timestamp ? util.formatDateWithMinutes(chats[chats.length-1].timestamp.seconds) : 'now'}</span>
          </p>
        }
      </div>
      <form onSubmit={handleSubmit} className="mx-3">
        <textarea className="form-control" name="content" onChange={handleChatContentChange} value={content}></textarea>
        {writeError ? <p className="text-danger">{writeError}</p> : null}
        <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
      </form>
      <div className="py-5 mx-3">
          Login in as: <strong className="text-info">{currentUser.uid}</strong>
      </div>
    </div>
  );
};

export default Chat;