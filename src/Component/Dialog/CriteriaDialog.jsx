import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

function createData(score, description) {
  return { score, description };
}

const rows = [
  createData('9 - 10', 'must watch'),
  createData('7 - 8.9', 'recommended'),
  createData('5 - 6.9', 'if you have time'),
  createData('< 5', 'not recommended')
];

const CriteriaDialog = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="criteria-dialog"
        aria-describedby="criteria-dialog"
      >
        <DialogTitle id="alert-dialog-title">Criteria</DialogTitle>
        <DialogContent>           
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Score</TableCell>
                  <TableCell align="right">Recommendation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.score}>
                    <TableCell component="th" scope="row">
                      {row.score}
                    </TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

CriteriaDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CriteriaDialog;