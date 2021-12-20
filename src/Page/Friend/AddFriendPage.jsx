import React, { useState } from 'react';
import { Button, IconButton, TextField, CircularProgress, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const defaultInput = {
  firstName: '',
  lastName: ''
};

const AddFriendPage = () => {
  const [itemInput, setItemInput] = useState(defaultInput);
  const [image, setImage] = useState();
  const [optionalFeatures, setOptionalFeatures] = useState([]);
  const [errorTexts, setErrorTexts] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log('optionalFeatures', optionalFeatures);

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };
  
  const onAddField = async () => {
    // trick to render the new list
    await setLoading(true);
    const prevFeatures = optionalFeatures;
    prevFeatures.push({
      'name': '',
      'type': 'String',
      'value': ''
    });
    const prevErrorTexts = errorTexts;
    prevErrorTexts.push('');
    setOptionalFeatures(prevFeatures);
    setErrorTexts(prevErrorTexts);
    setLoading(false);
  };

  const onFeatureNameChange = (prevFeatures, targetIndex, targetField, targetValue) => {
    // modify the key
    prevFeatures[targetIndex] = {
      ...prevFeatures[targetIndex],
      [targetField]: targetValue
    };
    setOptionalFeatures(prevFeatures);
    setLoading(false);
  };

  const onFeatureTypeChange = (prevFeatures, targetIndex, targetField, targetValue) => {
    // modify the key
    
    prevFeatures[index] = {
      ...prevFeatures[index],
      [targetField]: targetValue
    };
    setOptionalFeatures(prevFeatures);

    if(targetValue === 'List') {
      
    }

    setLoading(false);
  };

  const onFeatureValueChange = () => {
    const prevFeatures = optionalFeatures;
  };

  const onFeatureChangeNew = async e => {
    const prevFeatures = optionalFeatures;
    const targetName = e.target.name;
    const targetIndex = targetName.split(':')[0];
    const targetField = targetName.split(':')[1];
    const targetValue = e.target.value;
    await setLoading(true);
    // if name name change
    // just modify the name
    if(targetField === 'name') {
      onFeatureNameChange(prevFeatures, targetIndex, targetField, targetValue);
      return;
    }
   
      
    // if type change
    // modify the type and if value is missmatching, modify the value accordingly
    // if value change
    // modify the value based on the type
    if(targetField === 'type') {
      onFeatureTypeChange(prevFeatures, targetIndex, targetField, targetValue);
      return;
    }


    // // modify the key
    // prevFeatures[index] = {
    //   ...prevFeatures[index],
    //   [targetField]: targetValue
    // };
    // setOptionalFeatures(prevFeatures);
    // setLoading(false);
  };

  const onFeatureChange = async e => {
    // console.log('optionalFeatures', optionalFeatures);
    const prevFeatures = optionalFeatures;
    const prevErrorTexts = errorTexts;
    // console.log('e.target.name 1', e.target.name);
    const target = e.target;
    const index = target.name.split(':')[0];
    const field = target.name.split(':')[1];
    let newVal = target.value;
    console.log('newVal:', newVal);
    await setLoading(true);
    console.log('target.value', target.value);
    // console.log('index', index, 'field', field);
    // console.log('prevFeatures[index]: ', prevFeatures[index], 'new value: ',newVal);
    if(prevFeatures[index].type === 'List') {
      const multipleIndex = target.name.split(':')[2];
      console.log('multipleIndex: ', multipleIndex, '<- target.value', target.value, '<- newVal', newVal);
      if(typeof prevFeatures[index].value === 'string') {
        const newList = [];
        newList.push(target.value);
        prevFeatures[index].value = newList;
      } else {
        prevFeatures[index].value[parseInt(multipleIndex)] = target.value;
      }
      console.log('prevFeatures[index]!!!', prevFeatures[index]);
    } else {
      prevFeatures[index] = {
        ...prevFeatures[index],
        [field]: newVal
      };
    }

    let errorMessage = '';

    const type = prevFeatures[index].type;
    const val = prevFeatures[index].value;
    if(type === 'Double' && isNaN(val)) {
      errorMessage = 'selected type is Number but the value is text!';
    } else if(type === 'Boolean' && !(val === 'T' || val === 'F')) {
      errorMessage = 'For T/F, value should be T or F!';
    }
    prevErrorTexts[index] = errorMessage;
    // console.log('prevFeatures[index] after:', prevFeatures[index]);
    // console.log('prevErrorTexts[index] after: ', prevErrorTexts[index]);
    setOptionalFeatures(prevFeatures);
    setErrorTexts(prevErrorTexts);
    setLoading(false);
  };

  const convertStringToList = (value, index) => {
    // console.log('value in convertStringToList', value);
    if(value === '') {
      return [''];
    } else if (typeof value === 'string') {
      const prevFeatures = optionalFeatures;
      prevFeatures[index].value = [value];
      setOptionalFeatures(prevFeatures);
      return [value];
    }
    // console.log('convertStringToList', value);
    return value;
  };

  // const convertListToString = (value) => {
  //   return value.toString();
  // };

  const onAddListValue = async (index) => {
    const prevFeatures = optionalFeatures;
    await setLoading(true);
    prevFeatures[index].value.push('');
    prevFeatures[index] = {
      ...prevFeatures[index],
      ['value']: prevFeatures[index].value
    };
    setLoading(false);
  };

  // console.log('optionalFeatures', optionalFeatures,'errorTexts', errorTexts);

  return (
    <div>
      <h1>Add Friend</h1>
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        onChange={onFileChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
      <TextField className='input-field' id="firstName" name="firstName" label="First Name" 
        value={itemInput.firstName} onChange={onItemInputChange} />
      <TextField className='input-field' id="lastName" name="lastName" label="Last Name" 
        value={itemInput.lastName} onChange={onItemInputChange} />
      {optionalFeatures.map((feature, index) =>
        <div key={index}>
          <TextField className='input-field' id={index + ':name'} name={index + ':name'} label="Key" 
            value={feature.name} onChange={onFeatureChange} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
            <Select
              labelId={index + ':type-label'}
              id={index + ':type'}
              name={index + ':type'}
              value={feature.type}
              label="Data type"
              onChange={onFeatureChange}
            >
              <MenuItem value="String">Text</MenuItem>
              <MenuItem value="Double">Number</MenuItem>
              <MenuItem value="Boolean">T/F</MenuItem>
              <MenuItem value="List">Multiple</MenuItem>
              <MenuItem value="Timestamp">Time</MenuItem>
            </Select>
          </FormControl>
          {(feature.type === 'String' || feature.type === 'Double') &&
            <TextField className='input-field' id={index + ':value'} name={index + ':value'} label="Value" 
              value={feature.value} onChange={onFeatureChange} helperText={errorTexts[index]} 
              error={errorTexts[index] !== ''} 
            />
          }
          {feature.type === 'Boolean' && 
            <FormControl>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id={index + ':value'}
                name={index + ':value'}
                value={feature.value}
                label="Select"
                onChange={onFeatureChange}
              >
                <MenuItem value={'True'}>True</MenuItem>
                <MenuItem value={'False'}></MenuItem>
              </Select>
            </FormControl>
          }
          {feature.type === 'List' && 
            <div>
              {convertStringToList(feature.value, index).map((item, i) => 
                <TextField key={index + ':' + i} className='input-field' id={index + ':value:' + i} name={index + ':value:' + i} label='Value' 
                  value={item} onChange={onFeatureChange} helperText={errorTexts[index]} 
                  error={errorTexts[index] !== ''} 
                />
              )}
              <IconButton variant="contained" color="primary" onClick={() => onAddListValue(index)} aria-label="add">
                <AddIcon />
              </IconButton>
            </div>
          }
        </div>
      )}
      <Button variant="contained" color="primary" onClick={onAddField}>Add Field</ Button>
    </div>
  );
};

export default AddFriendPage;