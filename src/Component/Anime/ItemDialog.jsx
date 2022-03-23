import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import * as util from '../../util/util';
import { useAuth } from '../../Provider/AuthProvider';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import * as animeApi from '../../Firebase/anime';
import CustomListItem from '../../Component/Anime/CustomListItem';
import styles from './item-dialog.module.scss';

const ItemDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [loading, setLoading] = useState(true);
  const { id, name_english, name_japanese, name_japanese_ruby, tags, created, lastUpdated, user, mainImage, description, score } = props.item;
  const history = useHistory();
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const [characterList, setCharacterList] = useState([]);
  
  const volumeList = [
    {
      'type': 'light novel',
      'volume': 18,
      'continuing': true
    },
    {
      'type': 'comic',
      'volume': 19,
      'continuing': true
    },
    {
      'type': 'anime',
      'seasons': [
        {
          'name': 'season 1',
          'volume': 13
        },
        {
          'name': 'season 2',
          'volume': 13
        },
        {
          'name': 'season 3',
          'volume': 12
        },        
      ],
      'continuing': false
    },
  ];

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const getCharacterList = async () => {
    setLoading(true);
    const characterList = await animeApi.getCharacterList(id);
    setCharacterList(characterList);
    setLoading(false);
  };

  useEffect(() => {
    if(props.open) {
      getCharacterList();
    }
  }, [props.open]);

  const handleEdit = () => {
    history.push('/edit-anime-item', {
      item: props.item
    });
  };

  return (
    <div className={styles.dialogRoot}>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="item-dialog"
        aria-describedby="item-dialog"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className={styles.title}>{name_english + ' / ' + name_japanese + id}</DialogTitle>
        <DialogContent>
          <div className={styles.main}>
            <div className={styles.content}>
              <div className={styles.coverImageContainer}>
                <img className={styles.coverImage} src={mainImage} alt="Cover image" />
              </div>
              <div className={styles.contentInfo}>
                <div className={styles.details}>
                  <div className={styles.date}>Created: {util.formatDate(created.seconds)}</div>
                  <div className={styles.date}>Last Updated: {util.formatDate(lastUpdated.seconds)}</div>
                  <Rating name="read-only" value={score/2} precision={0.1} size="large" readOnly />
                  <div className={styles.score}>Score: {score}</div>
                  <div>Tags</div>
                  <Stack direction="column" spacing={1}>
                    {tags && tags.map((tag) =>
                      <Chip key={tag.id} label={tag.name} />
                    )}
                  </Stack>
                </div>
                <div className={styles.description}>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              </div>
            </div>
            <div className={styles.subContent}>
              <div className={styles.animeList}>
                {characterList.map((character) => 
                  <CustomListItem key={character.id} item={character} />
                )}
              </div>
              <div className={styles.contentInfo}>
                <div className={styles.contentLeft}>
                  <Typography component="legend">volume</Typography>
                  {volumeList.map((item) => 
                    item.volume ? 
                      <div className={styles.volumeItem} key={item.type}>
                        <Typography component="legend">{item.type}: {item.volume} {item.continuing ? '...' : ''}</Typography>
                      </div> : 
                      <div key={'seasons'}>
                        <Typography component="legend">{item.type}</Typography>
                        {
                          item.seasons.map((season) =>
                            <div className={styles.volumeItem} key={season.name}>
                              <Typography component="legend">{season.name}: {season.volume}</Typography>
                            </div>
                          )
                        }
                      </div>
                  )}
                </div>
              </div>
            </div>
            {userId === user && 
              <div className={styles.editButtonWrapper}>
                <Button variant="contained" onClick={handleEdit}>Edit</Button>
              </div>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name_english: PropTypes.string.isRequired,
    name_japanese: PropTypes.string.isRequired,
    name_japanese_ruby: PropTypes.string.isRequired,
    tags: PropTypes.array,
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

export default ItemDialog;