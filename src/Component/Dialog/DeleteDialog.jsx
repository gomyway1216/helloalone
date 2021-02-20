import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const DeleteDialog = (props) => {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);


  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="name">Delete {props.item.name}</DialogTitle>
        <DialogContent>
          Is it okay to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
              Cancel
          </Button>
          <Button onClick={props.onDelete} color="secondary" >
                Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func
};

export default DeleteDialog;