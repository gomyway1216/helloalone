import React, { useEffect, useState } from 'react';
import * as chatApi from '../../Firebase/chat';
import { useHistory } from 'react-router-dom';
import CreateChatGroupDialog from '../../Component/Dialog/CreateChatGroupDialog';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const ChatGroupListPage = () => {
  const [chatGroupList, setChatGroupList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const history = useHistory();

  const getChatGroupList = async () => {
    const result = await chatApi.getChatGroupList();
    setChatGroupList(result);
  };

  useEffect(() => {
    getChatGroupList();
  }, [dialogOpen]);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const createChatGroup = (itemInput) => {
    const password = itemInput.isPasswordRequired ? itemInput.password : '';
    try {
      chatApi.createChatGroup(itemInput.name, itemInput.isPasswordRequired, password, itemInput.description);
    } catch(err) {
      console.log('error creating chat group: ', err);
    } 
    setDialogOpen(false);
  };

  return (
    <div className="chat-group-container">
      <CreateChatGroupDialog open={dialogOpen} onClose={handleDialogClose} onSave={createChatGroup}/>
      <h1>Chat Group List</h1>
      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
        Create New Group
      </Button>
      <List component="nav" aria-label="main mailbox folders">
        {chatGroupList && chatGroupList.map(chatGroup =>
          <ListItem key={chatGroup.id} button onClick={() => history.push(`/chat/${chatGroup.id}`)}>
            <ListItemIcon>
              {chatGroup.value.isPasswordRequired ? <LockIcon /> : <LockOpenIcon />}
            </ListItemIcon>
            <ListItemText primary={chatGroup.value.name} secondary={chatGroup.value.description}/>
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default ChatGroupListPage;