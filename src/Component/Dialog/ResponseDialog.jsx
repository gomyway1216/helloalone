import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Button } from '@material-ui/core';

const ResponseDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const { isError, errorMessage } = props.responseStatus;

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="item-dialog"
        aria-describedby="item-dialog"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">Response</DialogTitle>
        <DialogContent>           
          <DialogContentText id="alert-dialog-description">
            {!isError ? 'Success!' : errorMessage }
          </DialogContentText>
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

ResponseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  responseStatus: PropTypes.shape({
    isError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
  })
};

export default ResponseDialog;