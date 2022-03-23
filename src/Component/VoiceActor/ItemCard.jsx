import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import styles from './item-card.module.scss';

const useStyles = makeStyles({
  root: {
    padding: 10,
    width: 300,
    height: 450,
    margin: 20
  },
  media: {
    height: 400
  },
  content: {
    padding: 5
  }
});

const ItemCard = (props) => {
  const classes = useStyles();
  const { id, name_english, name_japanese, image } = props.item;
  const history = useHistory();
  
  return (
    <>
      <Card className={classes.root} onClick={() => history.push(`/voice-actor/${id}`)}>
        <CardActionArea className={classes.action}>
          <CardMedia
            className={classes.media}
            image={image}
            title="Image title"
          />
          <CardContent className={classes.content} >
            <div className={styles.content}>
              <div className={styles.title}>{name_english + ' / ' + name_japanese}</div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name_english: PropTypes.string.isRequired,
    name_japanese: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  })
};

export default ItemCard;