import React, { useEffect, useState } from 'react';
import * as taskApi from '../../Firebase/task';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core/';
import { useAuth } from '../../Provider/AuthProvider';

const TaskCard = (props) => {
  const { id, duration } = props; 
  const [task, setTask] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  const getTask = async () => {
    const task = await taskApi.getTask(userId, id);
    setTask(task);
  };

  useEffect(() => {
    getTask();
  }, []);

  return (
    <>
      {task && (
        <div style={{ border: 'solid'}}>
          <div>
            {task.value.name}
          </div>
          <div>
            {task.value.description}
          </div>
          <div>
            expected: {task.value.duration}
          </div>
          <div>
            so far: {duration}
          </div>
          <Button variant="contained">
            Pause
          </Button>
          <Button variant="contained" color="primary">
            Start
          </Button>
        </div>
      )}
    </>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  id: PropTypes.string.isRequired,
  duration: PropTypes.number
};