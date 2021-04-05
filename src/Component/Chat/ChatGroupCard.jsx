import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import * as util from '../../util/util';
import shave from 'shave';

const ChatGroupCard = (props) => {
  const { chatGroup } = props;
  const { id, value } = chatGroup;
  const { name, isPasswordRequired} = value;
  let history = useHistory();
  // console.log('chatGroup',chatGroup);
  return (
    <div style={{width: '60%', height: '120px', display: 'flex',  
      flexDirection: 'row', justifyContent: 'space-between', margin: '20px', cursor: 'pointer'}} 
    onClick={() => history.push(`/chat/${id}`)}>
      <div>GroupName: {name}</div>
      <div>Private? : {isPasswordRequired ? 'YES' : 'NO'}</div>
    </div>
  );
};

export default ChatGroupCard;


ChatGroupCard.propTypes = {
  chatGroup: PropTypes.object.isRequired,
};