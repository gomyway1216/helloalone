import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Card, CardActionArea, CardActions, CardContent, 
  CardMedia, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const ProjectCard = (props) => {
  const classes = useStyles();
  const { title, description, image } = props;
  const history = useHistory();

  const handleOpenProject = () => {
    history.push(`/${props.id}`);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={handleOpenProject}>
        <CardMedia
          className={classes.media}
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handleOpenProject}>
          Check
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

ProjectCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};

export default ProjectCard;