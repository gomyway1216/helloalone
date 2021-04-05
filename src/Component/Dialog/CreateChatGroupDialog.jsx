import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const defaultItemInput = {name: '', isPasswordRequired: false, password: '', description: ''};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    },
  },
}));

const CreateChatGroupDialog = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(props.open);
  const [itemInput, setItemInput] = useState(defaultItemInput);

  useEffect(() => {
    setOpen(props.open);
    setItemInput(defaultItemInput);
  }, [props.open]);

  const handleItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="name">Create New Chat Group</DialogTitle>
        <DialogContent>
          <TextField id="name" name="name" label="Name" fullWidth value={itemInput.name} onChange={handleItemInputChange} />
          <FormControlLabel
            control={
              <Switch
                checked={itemInput.isPasswordRequired}
                onChange={handleSwitchChange}
                color="primary"
                name="isPasswordRequired"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="password required?"
          />
          <TextField id="password" name="password" label="Password" fullWidth disabled={!itemInput.isPasswordRequired} value={itemInput.password} onChange={handleItemInputChange} />
          <TextField id="description" name="description" label="Description" fullWidth multiline value={itemInput.description} onChange={handleItemInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} >
            Cancel
          </Button>
          <Button onClick={() => props.onSave(itemInput)} color="primary" >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CreateChatGroupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default CreateChatGroupDialog;