import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../../Firebase/blog';
import { TextField, Button } from '@material-ui/core';
import * as rankingConstants from './constants';

const AddNewItem = (props) => {
  const { itemName } = props;
  const [itemInput, setItemInput] = useState(rankingConstants.defaultInput);
  
  const onItemInputSave = () => {
    blogApi.addItem(rankingConstants.USER_NAME, itemName, itemInput)
      .then(() => setItemInput(rankingConstants.defaultInput))
      .catch(err => console.log(err));
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Add {itemName}</h1>
      <TextField id="title" name="title" label="Title" value={itemInput.title} onChange={onItemInputChange} />
      <TextField id="description" name="description" multiline label="Description" 
        value={itemInput.description} onChange={onItemInputChange} />
      <TextField id="short" name="short" label="Short title" value={itemInput.short} onChange={onItemInputChange} />
      <Button variant="contained" color="primary" onClick={onItemInputSave} >Save</ Button>
    </div>
  );
};

export default AddNewItem;

AddNewItem.propTypes = {
  itemName: PropTypes.string.isRequired,
};
