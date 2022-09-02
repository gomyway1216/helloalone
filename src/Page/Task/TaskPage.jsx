import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {TextField, InputLabel, MenuItem, FormControl, Select, Slider, Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import * as taskApi from '../../Firebase/task';
import { useAuth } from '../../Provider/AuthProvider';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ResponseDialog from '../../Component/Dialog/ResponseDialog';
import styles from './task-page.module.scss';

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100°%',
  },
];

const responseDialogDefaultVal = {
  isError: true,
  errorMessage: ''
};

const valuetext = (value) => {
  return `${value}%`;
};

const TaskPage = (props) => {
  let originalVal = {
    title: '',
    created: null,
    updated: null,
    status: 'Not Started',
    priority: 4,
    obtain: '',
    pain: '',
    fun: '',
    happiness: 50,
    findings: '',
    breather: ''
  };


  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const history = useHistory();
  const userId = currentUser.uid;
  const [responseStatus, setResponseStatus] = useState(responseDialogDefaultVal);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docId, setDocId] = useState(id);
  const [taskInput, setTaskInput] = useState(originalVal);

  const getTask = async () => {
    const taskResponse = await taskApi.getTask(userId, id);
    taskResponse.value.created = taskResponse.value.created.toDate();
    taskResponse.value.updated = taskResponse.value.updated.toDate();
    setTaskInput(taskResponse.value);
  };

  const handleInputChange = (event) => {
    setTaskInput({
      ...taskInput,
      [event.target.name]: event.target.value
    });
  };


  const handleSave = () => {
    if(!userId || !taskInput.title) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    taskApi.createTask(userId, taskInput, docId)
      .then(docRef => {
        if(docRef) {
          setDocId(docRef.id);
        }
        setResponseStatus({
          isError: false
        });
        setLoading(false);
      })
      .catch(err => {
        setResponseStatus({
          isError: true,
          errorMessage: err
        });
        setLoading(true);
        setDialogOpen(true);
      });
  };

  const handleSaveAndClose = () => {
    if(!userId || !taskInput.title) {
      setResponseStatus({
        isError: true,
        errorMessage: 'Please fill all the required fields'
      });
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    taskApi.createTask(userId, taskInput, docId)
      .then(() => {
        setResponseStatus({
          isError: false
        });
        setLoading(false);
        setDialogOpen(true);
      })
      .catch(err => {
        setResponseStatus({
          isError: true,
          errorMessage: err
        });
        setDialogOpen(true);
      });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // this prevents closing even we just want to save but no exiting
    if(!responseStatus.isError) {
      history.push('/task');
    }
  };

  useEffect(() => {
    if(id) {
      getTask();
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.item}>
        <TextField
          required
          id="title"
          name="title"
          label="Title"
          value={taskInput.title}
          onChange={handleInputChange}
          variant="standard"
          fullWidth
        />
      </div>
      <div className={styles.item}>
        {taskInput.created && 
          <div>Created: {taskInput.created.toLocaleDateString('en-US')}</div>
        }
        {taskInput.updated && 
          <div>Updated: {taskInput.updated.toLocaleDateString('en-US')}</div>
        }
      </div>
      <div className={styles.item}>
        <div className={styles.select}>
          <FormControl>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="select-label"
              id="status"
              name="status"
              value={taskInput.status}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value={'Not Started'}>Not Started</MenuItem>
              <MenuItem value={'In Progress'}>In Progress</MenuItem>
              <MenuItem value={'Completed'}>Completed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.select}>
          <FormControl>
            <InputLabel id="status-label">Priority</InputLabel>
            <Select
              labelId="select-label"
              id="priority"
              name="priority"
              value={taskInput.priority}
              label="Priority"
              onChange={handleInputChange}
            >
              <MenuItem value={0}>P0</MenuItem>
              <MenuItem value={1}>P1</MenuItem>
              <MenuItem value={2}>P2</MenuItem>
              <MenuItem value={3}>P3</MenuItem>
              <MenuItem value={4}>P4</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={styles.item}>
        <TextField
          id="obtain"
          name="obtain"
          label="What you obtain"
          multiline
          minRows={2}
          rowsMax={10}
          variant="filled"
          value={taskInput.obtain}
          onChange={handleInputChange}
          fullWidth
        />
      </div>
      <div className={styles.item}>
        <TextField
          id="pain"
          name="pain"
          label="Pain"
          multiline
          minRows={2}
          rowsMax={10}
          variant="filled"
          value={taskInput.pain}
          onChange={handleInputChange}
          fullWidth
        />
      </div>
      <div className={styles.item}>
        <TextField
          id="fun"
          name="fun"
          label="Fun Part"
          multiline
          minRows={2}
          rowsMax={10}
          variant="filled"
          value={taskInput.fun}
          onChange={handleInputChange}
          fullWidth
        />
      </div>
      <div className={styles.item}>
        <div className={styles.slider}>
          <Typography id="input-slider" gutterBottom className={styles.title}>
        Happiness
          </Typography>
          <Slider
            id="happiness"
            name="happiness"
            aria-label="Always visible"
            value={taskInput.happiness}
            getAriaValueText={valuetext}
            step={5}
            marks={marks}
            valueLabelDisplay="on"
            onChange={handleInputChange}
            fullWidth
          />
        </div>
      </div>
      <div className={styles.item}>
        <TextField
          id="findings"
          name="findings"
          label="Findings"
          multiline
          minRows={4}
          rowsMax={10}
          variant="filled"
          value={taskInput.findings}
          onChange={handleInputChange}
          fullWidth
        />
      </div>
      <div className={styles.item}>
        <TextField
          id="breather"
          name="breather"
          label="Breather"
          multiline
          minRows={2}
          rowsMax={10}
          variant="filled"
          value={taskInput.breather}
          onChange={handleInputChange}
          fullWidth
        />
      </div>
      <div className={styles.buttons}>
        <LoadingButton
          color="secondary"
          onClick={handleSave}
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save
        </LoadingButton>
        <Button variant="contained" onClick={handleSaveAndClose}>Save&Close</Button>
      </div>
      <ResponseDialog open={dialogOpen} responseStatus={responseStatus} onClose={handleDialogClose} />
    </div>
  );
};

// location is required when editing the existing value
TaskPage.propTypes = {
  location: PropTypes.object
};

export default TaskPage;