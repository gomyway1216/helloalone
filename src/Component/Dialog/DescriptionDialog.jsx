import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const DescriptionDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [itemInput, setItemInput] = useState(props.item);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    const chosenTags = props.tags.filter(
      tag => props.item.tags.filter(e => e === tag.id).length > 0
    );
    setItemInput({
      ...itemInput,
      tags: chosenTags,
    });
  }, []);

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  const onTagInputChange = (updatedTags) => {
    setItemInput({
      ...itemInput,
      tags: updatedTags,
    });
  };

  const onChangeSave = () => {
    if(!itemInput.name) {
      return;
    }
    props.onSave(itemInput);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="name">{itemInput.name}</DialogTitle>
        <DialogContent>
          <div>
            <TextField id="name" name="name" label="Name" value={itemInput.name} onChange={onItemInputChange} />
            <TextField id="description" name="description" multiline label="Description" value={itemInput.description} onChange={onItemInputChange} />
            <TextField id="short" name="short" label="Short name" value={itemInput.short} onChange={onItemInputChange} />
            <Autocomplete
              multiple
              id="fixed-tags-demo"
              value={itemInput.tags}
              onChange={(event, newValue) => {
                onTagInputChange([...newValue]);
              }}
              options={props.tags}
              getOptionLabel={(option) => option.name}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip key={index} label={option.name} {...getTagProps({ index })} />
                ))
              }
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fixed tag"
                  variant="outlined"
                  placeholder="Favorites"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} >
              Cancel
          </Button>
          {props.partOfRanking &&
            <Button onClick={props.onDeleteFromRanking} color="primary">
              Delete
            </Button>
          }
          <Button onClick={onChangeSave} color="primary">
              Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DescriptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  partOfRanking: PropTypes.bool,
  onDeleteFromRanking: PropTypes.func
};

export default DescriptionDialog;