import React from 'react';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, items, theme) {
  return {
    fontWeight:
      items.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelect = (props) => {
  const theme = useTheme();
  const { title, name, list, items, setItems, freeSolo } = props;

  const handleChange = (val) => {
    setItems(val);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Autocomplete
          freeSolo={freeSolo}
          multiple
          id={title}
          value={items}
          onChange={(event, newValue) => {
            if(typeof newValue[newValue.length - 1] === 'string') {
              newValue[newValue.length - 1] = {
                id: null,
                name: newValue[newValue.length - 1]
              };
            }
            handleChange([...newValue]);
          }}
          options={list}
          getOptionLabel={(option) => option.name}
          renderTags={(values, getTagProps) =>
            values.map((option, index) => (
              <Chip key={index} label={option.name} {...getTagProps({ index })} />
            ))
          }
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={title}
              variant="outlined"
              placeholder="Favorites"
            />
          )}
        />
      </FormControl>
    </div>
  );
};

export default MultipleSelect;

MultipleSelect.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  freeSolo: PropTypes.bool.isRequired
};