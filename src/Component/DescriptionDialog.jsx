import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

const VIEW_MODE = 'view_mode';
const EDIT_MODE = 'edit_mode';
const DELETE_MODE = 'delete_mode';

const DescriptionDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [animeInput, setAnimeInput] = useState(props.animeObj);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onAnimeInputChange = e => {
    setAnimeInput({
      ...animeInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{animeInput.title}</DialogTitle>
        <DialogContent>
          {props.dialogMode === VIEW_MODE && <DialogContentText id="alert-dialog-description">
            {animeInput.description}
          </DialogContentText>}
          {props.dialogMode === EDIT_MODE && 
          <div>
            <TextField id="title" name="title" label="Title" value={animeInput.title} onChange={onAnimeInputChange} />
            <TextField id="description" name="description" multiline label="Description" value={animeInput.description} onChange={onAnimeInputChange} />
            <TextField id="short" name="short" label="Short title" value={animeInput.short} onChange={onAnimeInputChange} />
          </div>}
        </DialogContent>
        {(props.dialogMode === EDIT_MODE || props.dialogMode === DELETE_MODE) && 
          <DialogActions>
            <Button onClick={props.onClose} color="primary">
              Cancel
            </Button>
            {props.dialogMode === EDIT_MODE && 
              <Button onClick={() => props.onSave(animeInput)} color="primary">
                Save
              </Button>}
            {props.dialogMode === DELETE_MODE && 
              <Button onClick={props.onDelete} color="secondary" >
                Delete
              </Button>
            }
          </DialogActions>
        }
      </Dialog>
    </div>
  );
};

DescriptionDialog.propTypes = {
  dialogMode: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  animeObj: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onDelete: PropTypes.func
};

export default DescriptionDialog;