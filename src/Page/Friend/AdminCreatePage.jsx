import React, { useEffect, useState } from 'react';
import { TextField, Backdrop, Button, CircularProgress } from '@mui/material';
import { getActivityCategories, insertActivityCategory, getActivityTypes, insertActivityType } from '../../api/friend';
import MultipleSelect from '../../Component/General/MultipleSelect';
import { useHistory } from 'react-router-dom';


const typeDefaultInput = {
  typeName: '',
  activityCategories: []
};

const AdminCreatePage = () => {
  const [loading, setLoading] = useState(true);
  const [activityCategoryEntryList, setActivityCategoryEntryList] = useState([]);
  const [activityTypeEntryList, setActivityTypeEntryList] = useState([]);
  const history = useHistory();
  const [categoryInput, setCategoryInput] = useState('');
  const [typeInput, setTypeInput] = useState(typeDefaultInput);
  const [errorText, setErrorText] = useState({});
  const [error, setError] = useState('');

  const getActivityCategoryEntryList = async () => {
    setLoading(true);
    try {
      const entries = await getActivityCategories();
      setActivityCategoryEntryList(entries);
      // setLoading(false);
    } catch (e) {
      console.log('there is an error fetching activity categories', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
  };

  const getActivityTypeEntryList = async () => {
    setLoading(true);
    try {
      const entries = await getActivityTypes();
      setActivityTypeEntryList(entries);
      setLoading(false);
    } catch (e) {
      console.log('there is an error fetching activity types', e);
      if (e.response.status === 403) {
        history.push('/user-signin');
      }
    }
  };

  useEffect(() => {
    getActivityCategoryEntryList();
    getActivityTypeEntryList();
  }, []);

  const onCategoryInputChange = e => {
    setCategoryInput(e.target.value);
  };

  const onTypeInputChange = e => {
    setTypeInput({
      ...typeInput,
      [e.target.name]: e.target.value
    });
  };

  const onTypeClassificationInputChange = val => {
    console.log('val!!!!', val);
    setTypeInput({
      ...typeInput,
      ['activityCategories']: val
    });
  };

  const onCategorySave = async () => {
    let validated = true;
    const newErrorText = { ...errorText };

    if(!categoryInput) {
      validated = false;
      newErrorText.categoryInput = 'categoryInput is invalid!';
    } else {
      newErrorText.categoryInput = '';
    }

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText({});

    try {
      setError('');
      setLoading(true);
      const entry = {
        name: categoryInput
      };
      const response = await insertActivityCategory(entry);
      if (!response) {
        console.log('Saving data failed!');
        return;
      }
      const prev = activityCategoryEntryList;
      prev.push(response);
      setActivityCategoryEntryList(prev);
      setCategoryInput('');
      // history.push('/my-dictionary');
    } catch (e) {
      console.log('error saving activity category record', e);
      setError(e.message);
    }

    setLoading(false);
  };

  const onTypeSave = async () => {
    const { typeName: name, activityCategories } = typeInput;
    let validated = true;
    const newErrorText = { ...errorText };

    if(!name) {
      validated = false;
      newErrorText.typeName = 'typeName is invalid!';
    } else {
      newErrorText.typeName = '';
    }

    if(!activityCategories || activityCategories.length == 0) {
      validated = false;
      newErrorText.activityCategories = 'activity category cannot be empty. Add at least one category!';
    } else {
    }
    const activityCategoryIds = activityCategories.map(e => e.id);

    if(!validated) {
      setErrorText(newErrorText);
      return;
    }

    setErrorText({});

    try {
      setError('');
      setLoading(true);
      const entry = {
        name,
        activityCategoryIds
      };
      const response = await insertActivityType(entry);
      if (!response) {
        console.log('Saving data failed!');
        return;
      }
      const prev = activityTypeEntryList;
      prev.push(response);
      setActivityTypeEntryList(prev);
      setTypeInput(typeDefaultInput);
      // history.push('/my-dictionary');
    } catch (e) {
      console.log('error saving activity type record', e);
      setError(e.message);
    }

    setLoading(false);
  };


  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <div>
        <h1>Activity Category List</h1>
        <div>
          <TextField label="Activity Category" value={categoryInput} name="activityCategory" onChange={onCategoryInputChange}/>
          <Button variant="contained" color="primary" onClick={onCategorySave}>Save</Button>
          <div>
            {activityCategoryEntryList.map((entry) => 
              <div key={entry.id}>{entry.name}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h1>Activity Type List</h1>
        <div>
          <TextField label="Activity Type" value={typeInput.typeName} name="typeName" onChange={onTypeInputChange}/>
          <MultipleSelect title="Category" name="activityCategories" list={activityCategoryEntryList} 
            items={typeInput.activityCategories} setItems={onTypeClassificationInputChange} freeSolo={true}/>
          <Button variant="contained" color="primary" onClick={onTypeSave}>Save</Button>
          <div>
            {activityTypeEntryList.map((entry) => 
              <div key={entry.id}>{entry.name}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePage;