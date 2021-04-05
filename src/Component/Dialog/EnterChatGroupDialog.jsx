import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

const EnterChatGroupDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleChange = e => {
    setPassword(e.target.value);
  };

  const handleEnterPassword = async () => {
    const error = await props.onSave(password);
    console.log('error', error);
    setError(error);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="name">Enter password for this group</DialogTitle>
        <DialogContent>
          <TextField id="password" name="password" label="Password" fullWidth value={password} onChange={handleChange} />
          <DialogContentText className="error-text">
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} >
            Cancel
          </Button>
          <Button onClick={handleEnterPassword} color="primary" >
            Try!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

EnterChatGroupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default EnterChatGroupDialog;