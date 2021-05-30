import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import * as util from '../../util/util';
import ClampLines from 'react-clamp-lines';
import './custom-card.scss';

const CustomCard = (props) => {
  const { id, name, created, user, mainImage, description } = props.item;
  const history = useHistory();

  return (
    <div className="custom-card-wrapper" 
      onClick={() => history.push(`/blog/${id}`)}>
      <div className="main">
        <div className="title">{name}</div>
        <ClampLines
          text={description}
          id="anime-description-id"
          lines={2}
          buttons={false}
          ellipsis="..."
          className="description"
          innerElement="p"
        />
        <div className="detailed-info">
          <div>{util.formatDate(created.seconds)}</div>
        </div>
      </div>
      <div className="main-image-wrapper">
        <img className="main-image" src={mainImage} alt="Main Image"/>
      </div>
    </div>
  );
};

CustomCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.any.isRequired,
    lastUpdated: PropTypes.shape({
      nanoseconds: PropTypes.number.isRequired,
      seconds: PropTypes.number.isRequired
    }),
    mainImage: PropTypes.string.isRequired
  })
};

export default CustomCard;