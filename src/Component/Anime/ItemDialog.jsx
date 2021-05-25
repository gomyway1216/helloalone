import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import * as util from '../../util/util';
import { useAuth } from '../../Provider/AuthProvider';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import './item-dialog.scss';

const ItemDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const { id, name, created, lastUpdated, user, mainImage, description } = props.item;
  const history = useHistory();
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleEdit = () => {
    history.push('/edit-anime-item', {
      item: props.item
    });
  };

  return (
    <div className="dialog-root">
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="item-dialog"
        aria-describedby="item-dialog"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="name">{name}</DialogTitle>
        <DialogContent>
          <div className="cover-image-container">
            <img className='cover-image' src={mainImage} alt="Cover image" />
          </div>
          <div className="content-info">
            <div className="date">{util.formatDate(created.seconds)}</div>
            <div className="date">{util.formatDate(lastUpdated.seconds)}</div>
          </div>
          {userId === user && 
            <div className="edit-button-wrapper">
              <Button variant="contained" onClick={handleEdit}>Edit</Button>
            </div>
          }
          <ReactMarkdown>{description}</ReactMarkdown>
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
    name: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.any.isRequired,
    lastUpdated: PropTypes.any.isRequired,
    mainImage: PropTypes.string.isRequired
  })
};

export default ItemDialog;