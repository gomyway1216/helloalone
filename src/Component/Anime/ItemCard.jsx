import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import ItemDialog from './ItemDialog';

const useStyles = makeStyles({
  root: {
    padding: 10,
    width: 300,
    height: 300,
    margin: 20
  },
  media: {
    height: 160
  },
});

const ItemCard = (props) => {
  const classes = useStyles();
  const { name, created, user, mainImage, description } = props.item;
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
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={mainImage}
            title="Image title"
          />
          <CardContent>
            <Typography align="center" gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography align="center" variant="body2" color="textSecondary" component="p">
              <ReactMarkdown>{description}</ReactMarkdown>
            </Typography>
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
    created: PropTypes.any.isRequired,
    lastUpdated: PropTypes.any.isRequired,
    mainImage: PropTypes.string.isRequired
  })
};

export default ItemCard;