import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogActions } from '@material-ui/core';

const EditRankingNameDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [itemInput, setItemInput] = useState(props.ranking);

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
        <TextField id="name" name="name" label="Name" value={itemInput.name} onChange={onItemInputChange} />
        <DialogActions>
          <Button onClick={props.onClose} >
            Cancel
          </Button>
          <Button onClick={props.onSave(itemInput)} color="primary" >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

EditRankingNameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  ranking: PropTypes.object.isRequired
};

export default EditRankingNameDialog;