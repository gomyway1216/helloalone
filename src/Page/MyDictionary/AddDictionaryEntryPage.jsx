import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { InputLabel, MenuItem, FormControl, Select, Switch, FormControlLabel } from '@mui/material';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { addDictionaryEntry, addTagEntry, getTagEntries } from '../../api/myDictionary';
import MultipleSelect from '../../Component/General/MultipleSelect';
import styles from './add-dictionary-entry-page.module.scss';

const defaultInput = {
  title: '',
  title_japanese: '',
  tags: [],
  newTag: '',
  description: '',
  priority: 4,
  isCompleted: false
};

const AddDictionaryEntryPage = () => {
  const [tagList, setTagList] = useState([]);
  const [itemInput, setItemInput] = useState(defaultInput);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(defaultInput);
  const [error, setError] = useState('');
  const history = useHistory();

  const getTags = async () => {
    setLoading(true);
    try {
      const entries = await getTagEntries();
      setTagList(entries);
    } catch (e) {
      console.log('there is an error fetching tags', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getTags();
  }, []);

  const onSave = async () => {
    const { title, title_japanese, tags, description, priority, isCompleted } = itemInput;
    let validated = true;
    const newErrorText = { ...errorText };

    if(!title) {
      validated = false;
      newErrorText.title = 'title is invalid!';
    } else {
      newErrorText.title = '';
    }

    if(!description) {
      validated = false;
      newErrorText.description = 'description is invalid!';
    } else {
      newErrorText.description = '';
    }

    const tagIds = [];
    if(!tags || tags.length == 0) {
      validated = false;
      newErrorText.tags = 'tags cannot be empty. Add at least one tag!';
    } else {
      for(let i = 0; i < tags.length; i++) {
        const tag = tagList.find(e => e.name === tags[i]);
        tagIds.push(tag.id);
      }
      console.log('tagIds', tagIds);
      if(tags.length !== tagIds.length) {
        newErrorText.tags = 'some tags does not exist. Please check them again!';
      } else {
        newErrorText.tags = '';
      }
    }

    if(!priority) {
      validated = false;
      newErrorText.title = 'priority is not defined!';
    } else {
      newErrorText.priority;
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText(defaultInput);

    try {
      setError('');
      setLoading(true);
      console.log('tags', tags);
      const entry = {
        title,
        title_japanese,
        tags: tagIds,
        description,
        priority,
        isCompleted
      };
      const response = await addDictionaryEntry(entry);
      console.log('response', response);
      if (!response) {
        console.log('Saving data failed!');
        return;
      }
      history.push('/my-dictionary');
    } catch (e) {
      setError(e.message);
    }
    
    setLoading(false);
  };

  const onItemInputChange = e => {
    console.log('onItemInputChange', e);
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSwitchChange = (e) => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.checked
    });
  };

  const addTag = async () => {
    if(!itemInput.newTag) {
      errorText.newTag = 'adding tag cannot be empty';
      setErrorText(errorText);
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await addTagEntry(itemInput.newTag);
      console.log('add tag response', response);
      if (response) {
        getTags();
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div>Create Dictionary Entry</div>
      <div>
        {error && 
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        }
        <TextField className={styles.inputField} id="title" name="title" label="title" 
          value={itemInput.title} onChange={onItemInputChange} helperText={errorText.title}/>
        <TextField className={styles.inputField} id="title_japanese" name="title_japanese" label="Japanese title" 
          value={itemInput.title_japanese} onChange={onItemInputChange} helperText={errorText.title_japanese}/>
        <MultipleSelect title="tags" list={tagList} items={itemInput.tags} setItems={onItemInputChange}/>
        <div className={styles.inputField}>
          <TextField id="newTag" name="newTag" label="Add new tag" 
            value={itemInput.newTag} onChange={onItemInputChange} helperText={errorText.itemInput}/>
          <Button variant="text" onClick={addTag}>Add Tag</Button>
        </div>
        <TextField className={styles.inputField} id="description" name="description" label="description" 
          multiline rows={4}
          value={itemInput.description} onChange={onItemInputChange} helperText={errorText.description}/>
        <FormControl fullWidth>
          <InputLabel>priority</InputLabel>
          <Select
            id="priority"
            name="priority"
            value={itemInput.priority}
            label="priority"
            onChange={onItemInputChange}
          >
            <MenuItem value={0}>P0</MenuItem>
            <MenuItem value={1}>P1</MenuItem>
            <MenuItem value={2}>P2</MenuItem>
            <MenuItem value={3}>P3</MenuItem>
            <MenuItem value={4}>P4</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel control={ 
          <Switch
            name="isCompleted"
            checked={itemInput.isCompleted}
            onChange={handleSwitchChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />} label="Is this task completed?" />
        <Button variant="contained" color="primary" onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default AddDictionaryEntryPage;