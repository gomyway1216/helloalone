import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { getMockData } from './mockdata';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useHistory } from 'react-router-dom';
import * as friendApi from '../../Api/friend'; 
import FriendCard from '../../Component/Friend/FriendCard';


const Friends = () => {
  const mockData = getMockData();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [friendList, setFriendList] = useState([]);

  const getFriends = async () => {
    setLoading(true);
    const list = await friendApi.getFriends();
    console.log('getFriends response', list);
    setFriendList(list);
    setLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      <Fab color="primary" aria-label="add" onClick={() => history.push('/add-friend')} >
        <AddIcon />
      </Fab>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {friendList && friendList.map(item => 
          <FriendCard key={item.id} item={item} />
        )}
      </List>
    </>
  );
};

export default Friends;



{/* <Box sx={{ '& > :not(style)': { m: 1 } }}>
<Fab color="primary" aria-label="add">
  <AddIcon />
</Fab>
</Box> */}