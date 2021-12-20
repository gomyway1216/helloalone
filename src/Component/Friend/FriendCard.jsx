import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useHistory } from 'react-router-dom';

const FriendCard = (props) => {
  const { id, firstName, lastName, image, optionalFeatures } = props.item;
  const history = useHistory();

  return (
    <>
      <ListItem key={id} onClick={() => history.push(`/friends/${id}`)}>
        <ListItemAvatar>
          <Avatar alt="al" src={image} />
        </ListItemAvatar>
        <ListItemText primary={firstName + ' ' + lastName} />
      </ListItem>
    </>
  );
};

FriendCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    image: PropTypes.string,
    optionalFeatures: PropTypes.object.isRequired
  })
};

export default FriendCard;