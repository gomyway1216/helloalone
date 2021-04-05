import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const CreateRankingDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [itemInput, setItemInput] = useState({name: ''});

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
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
        <DialogTitle id="name">Create New Ranking</DialogTitle>
        <DialogContent>
          <TextField id="name" name="name" label="Name" fullWidth value={itemInput.name} onChange={onItemInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} >
            Cancel
          </Button>
          <Button onClick={props.onSave(itemInput.name)} color="primary" >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CreateRankingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default CreateRankingDialog;