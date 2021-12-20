import React, { useState, useEffect } from 'react';
import * as blogApi from '../../Firebase/blog';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as util from '../../util/util';
import { useAuth } from '../../Provider/AuthProvider';
import { Button } from '@material-ui/core';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import * as friendApi from '../../Api/friend';

const Friend = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [friend, setFriend] = useState();
  
  const getFriend = async () => {
    setLoading(true);
    const friendResponse = await friendApi.getFriendById(id);
    console.log('getFriend response', friendResponse);
    setFriend(friendResponse);
    setLoading(false);
  };

  useEffect(() => {
    getFriend();
  }, []);

  return (
    <>
      {friend &&
        <ListItem key={friend.id}>
          <ListItemAvatar>
            <Avatar alt="al" src={friend.image} />
          </ListItemAvatar>
          <ListItemText primary={friend.firstName + ' ' + friend.lastName} />
        </ListItem>
      }
    </>
  );
};

export default Friend;