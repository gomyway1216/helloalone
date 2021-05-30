import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import ItemDialog from './ItemDialog';
import ClampLines from 'react-clamp-lines';
import './item-card.scss';

const useStyles = makeStyles({
  root: {
    padding: 10,
    width: 300,
    height: 300,
    margin: 20
  },
  media: {
    height: 170
  },
});

const ItemCard = (props) => {
  const classes = useStyles();
  const { name, created, user, mainImage, description, score } = props.item;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickItem = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card className={classes.root} onClick={handleClickItem}>
        <CardActionArea className={classes.action}>
          <CardMedia
            className={classes.media}
            image={mainImage}
            title="Image title"
          />
          <CardContent >
            <div className="content">
              <div className="title">{name}</div>
              <div className='main'>
                <ClampLines
                  text={description}
                  id="anime-description-id"
                  lines={2}
                  buttons={false}
                  ellipsis="..."
                  className="description"
                  innerElement="p"
                />
                <div className='score'>{score}</div>
              </div>    
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
      <ItemDialog item={props.item} open={dialogOpen} onClose={handleDialogClose}/>
    </>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    created: PropTypes.any.isRequired,
    lastUpdated: PropTypes.shape({
      nanoseconds: PropTypes.number.isRequired,
      seconds: PropTypes.number.isRequired
    }),
    mainImage: PropTypes.string.isRequired
  })
};

export default ItemCard;