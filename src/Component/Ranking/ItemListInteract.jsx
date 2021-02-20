import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../../Firebase/blog';
import { TextField, Button, List, ListItem, ListItemText, Chip } from '@material-ui/core';
import * as rankingConstants from './constants';
import DescriptionDialog from '../Dialog/DescriptionDialog';
import DeleteDialog from '../Dialog/DeleteDialog';
import Autocomplete from '@material-ui/lab/Autocomplete';

const EDIT_MODE = 'edit_mode';
const DELETE_MODE = 'delete_mode';

const ItemListInteract = (props) => {
  const { tags } = props;
  const [itemInput, setItemInput] = useState(rankingConstants.defaultInput);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState();
  const [openingDialogItem, setOpenDialogItem] = useState();
  const [dialogMode, setDialogMode] = useState();

  useEffect(() => {
    blogApi.streamItemList(rankingConstants.USER_NAME, 'itemCollection', {
      next: querySnapshot => {
        setLoading(true);
        const updateItems = querySnapshot.docs.map(docSnapShot => (
          {id: docSnapShot.id, ...docSnapShot.data()}
        ));
        setItemList(updateItems);
        setLoading(false);
      }
    });
  }, []);
  
  const onItemInputSave = () => {
    if(!itemInput.name) {
      // TODO set error modal
      return;
    }
    const tagIds = itemInput.tags.map(tag => tag.id);
    const item = {...itemInput, tags: tagIds};
    blogApi.addItem(rankingConstants.USER_NAME, item)
      .then(() => {
        setItemInput(rankingConstants.defaultInput);
        
      })
      .catch(err => console.log(err));
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  const onTagInputChange = (updatedTags) => {
    setItemInput({
      ...itemInput,
      tags: updatedTags
    });
  };

  const onItemInputUpdate = (itemVal) => {
    let tagIds = itemVal.tags.map(tag => tag.id);
    const item = {...itemVal, tags: tagIds};
    blogApi.updateItem(rankingConstants.USER_NAME, item)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  const onItemDelete = () => {
    blogApi.deleteItem(rankingConstants.USER_NAME, openingDialogItem.id, handleCloseDialog);
  };

  const handleCloseDialog = () => {
    setOpenDialogItem(null);
    setDialogMode('');
  };

  return (
    <div>
      <div>
        <h1>Add Item</h1>
        <TextField id="name" name="name" label="name" value={itemInput.name} onChange={onItemInputChange} />
        <TextField id="description" name="description" multiline label="Description" 
          value={itemInput.description} onChange={onItemInputChange} />
        <TextField id="short" name="short" label="Short name" value={itemInput.short} onChange={onItemInputChange} />
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Autocomplete
            multiple
            id="tags"
            value={itemInput.tags}
            onChange={(event, newValue) => {
              onTagInputChange([...newValue]);
            }}
            options={tags}
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
                label="Tags"
                variant="outlined"
                placeholder="Favorites"
              />
            )}
          />
          <Button variant="contained" color="primary" onClick={onItemInputSave}>Save</ Button>
        </div>

      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <List component="nav" style={{ maxHeight: 500, width: 400, overflow: 'auto'}}>
          {itemList.map((item) => (
            <ListItem button key={item.id} style={{ background: openingDialogItem === item
              ? 'Cyan'
              : 'AliceBlue'}} 
            onClick={() => setOpenDialogItem(item)}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <div style={{margin: 30}}>
          <Button variant="contained" color="primary" onClick={() => setDialogMode(EDIT_MODE)} style={{margin: 20}}>Edit</ Button>
          <Button variant="contained" color="secondary" onClick={() => setDialogMode(DELETE_MODE)}>Delete</ Button>
        </div>
      </div>
      {(dialogMode === EDIT_MODE && openingDialogItem) && 
        <DescriptionDialog item={openingDialogItem} 
          tags={tags} open={dialogMode === EDIT_MODE} onClose={handleCloseDialog} onSave={onItemInputUpdate}/>}
      {(dialogMode === DELETE_MODE && openingDialogItem) && 
        <DeleteDialog item={openingDialogItem} 
          open={dialogMode === DELETE_MODE} onClose={handleCloseDialog} onDelete={onItemDelete}/>}
    </div>
  );
};

export default ItemListInteract;

ItemListInteract.propTypes = {
  tags: PropTypes.array.isRequired
};
