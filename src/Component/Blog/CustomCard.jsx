import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { useHistory } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import * as util from '../../util/util';
import shave from 'shave';

const CustomCard = (props) => {
  const { blog } = props;
  const history = useHistory();

  useEffect(() => {
    shave('.textInitial', 48);
  }, [blog.value.body]);

  return (
    <div style={{width: '60%', height: '120px', display: 'flex',  
      flexDirection: 'row', justifyContent: 'space-between', margin: '20px', cursor: 'pointer'}} 
    onClick={() => history.push(`/blog/${blog.id}`)}>
      <div style={{width: '70%', overflow: 'hidden', textOverflow: 'ellipsis',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px'}}>
        <div style={{ fontWeight: 'bold', fontSize: 'x-large' }}>{blog.value.name}</div>
        <div className="textInitial" style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{parse(blog.value.body)}</div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <div>{util.formatDate(blog.value.timestamp.seconds)}</div>
          <FavoriteBorderIcon />
        </div>
      </div>
      <div style={{ padding: '5px', width: '30%'}}>
        <img style={{width: '100%', height: '100%', objectFit: 'cover' }} src={blog.value.mainImage} alt="Main Image"/>
      </div>
    </div>
  );
};

export default CustomCard;


CustomCard.propTypes = {
  blog: PropTypes.object.isRequired,
  history: PropTypes.object
};