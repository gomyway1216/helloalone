import React, { useEffect, useState } from 'react';
import { TextField, Backdrop, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { getFriends } from '../../api/friend';
import CustomListItem from '../../Component/Friend/CustomListItem';
import { useHistory } from 'react-router-dom';
import styles from './friend-list-page.module.scss';
import AddIcon from '@mui/icons-material/Add';


const FriendListPage = () => {
  const [loading, setLoading] = useState(true);
  const [friendEntryList, setFriendEntryList] = useState([]);
  const history = useHistory();
  const [errorText, setErrorText] = useState({});
  const [error, setError] = useState('');

  const getFriendEntryList = async () => {
    setLoading(true);
    try {
      const entries = await getFriends();
      setFriendEntryList(entries);
      setLoading(false);
    } catch (e) {
      console.log('there is an error fetching friends', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
  };

  useEffect(() => {
    getFriendEntryList();
  }, []);

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <h1>Friends</h1>
      <Tooltip title="Add Friend">
        <IconButton color="primary" aria-label="Add Friend" size="large" onClick={() => history.push('/friend/create')}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <div className={styles.content}>
        <div className={styles.friendListContainer}>
          {friendEntryList.map((friend) => 
            <CustomListItem key={friend.id} item={friend} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendListPage;