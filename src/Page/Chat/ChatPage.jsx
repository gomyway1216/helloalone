import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../Provider/AuthProvider';
import * as chatApi from '../../Firebase/chat';
import { useParams } from 'react-router-dom';
import * as util from '../../util/util';
import { useInView } from 'react-intersection-observer';
import { useHistory } from 'react-router-dom';
import EnterChatGroupDialog from '../../Component/Dialog/EnterChatGroupDialog';
import { TextField, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './chatPage.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '75%',
    },
  },
}));

const Chat = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const history = useHistory();
  const [chats, setChats] = useState([]);
  const [content, setContent] = useState('');
  const [writeError, setWriteError] = useState();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState();
  const [viewChangeCounter, setViewChangeCounter] = useState(0);
  const topRef2 = useRef();
  const bottomRef2 = useRef();
  const PAGE_SIZE = 10;
  const [oldMessageSize, setOldMessageSize] = useState(PAGE_SIZE);
  const stateRef = useRef();
  stateRef.current = chats;
  const [dialogOpen, setDialogOpen] = useState(true);

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
    checkPasswordRequired();
  }, []);

  useEffect(() => {  
    if(!password) {
      return;
    }

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
  }, [password]);

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

  const handleDialogClose = () => {
    history.push('/chat');
  };

  const enterGroupPassword = async (password) => {
    const access = await chatApi.checkChatGroupAccess(id, password);
    if(access) {
      setPassword(password);
    } else {
      return 'Password is wrong.';
    }
  };

  const checkPasswordRequired = async () => {
    const isPasswordRequired = await chatApi.checkPasswordRequired(id);
    if(!isPasswordRequired) {
      setPassword('password not required');
    }
    return isPasswordRequired;
  };

  if(!password) {
    return <EnterChatGroupDialog open={dialogOpen} onClose={handleDialogClose} onSave={enterGroupPassword} />;
  }

  return(
    <div className={classes.root}>
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
      <form onSubmit={handleSubmit}>
        <div className='message-group'>
          <TextField
            id="message-textfield"
            label="Multiline"
            multiline
            fullWidth
            rowsMax={4}
            value={content}
            onChange={handleChatContentChange}
          />
          <Button variant="contained" color="primary" type='submit'>Send</Button>
        </div>
        {writeError ? <p>{writeError}</p> : null}
      </form>
      <div className="py-5 mx-3">
          Login in as: <strong className="text-info">{currentUser.uid}</strong>
      </div>
    </div>
  );
};

export default Chat;