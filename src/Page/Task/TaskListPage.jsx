import React, { useState, useEffect } from 'react';
import * as taskApi from '../../Firebase/task';
import { useAuth } from '../../Provider/AuthProvider';
import {Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ZeroIcon from '../../assets/icons/0.svg';
import OneIcon from '../../assets/icons/1.svg';
import TwoIcon from '../../assets/icons/2.svg';
import ThreeIcon from '../../assets/icons/3.svg';
import FourIcon from '../../assets/icons/4.svg';
import { useHistory } from 'react-router-dom';
import styles from './task-list-page.module.scss';

const TaskListPage = () => {
  const history = useHistory();
  const [taskList, setTaskList] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  const getTaskList = async () => {
    const taskList = await taskApi.getTasks(userId);
    setTaskList(taskList);
  };

  const IconSelector = (priority) => {
    if(priority === 0) {
      return ZeroIcon; 
    } else if (priority === 1) {
      return OneIcon;
    } else if (priority === 2) {
      return TwoIcon;
    } else if (priority === 3) {
      return ThreeIcon;
    } else if (priority === 4) {
      return FourIcon;
    }
  };

  useEffect(() => {
    getTaskList();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.pageTitle}>Task List</div>
      <div className={styles.items}>
        {taskList && taskList.map(task => (
          <div key={task.id} onClick={() => history.push(`/task/${task.id}`)} className={styles.item}>
            <div>
              <img src={IconSelector(task.value.priority)} alt="One Icon"/>
            </div>
            <div>{task.value.title}</div>
            <div className={styles.status}>{task.value.status}</div>
          </div>

        ))
        }
      </div>

      <Fab color="primary" aria-label="add" className={styles.fab} onClick={() => history.push('/task/create-task')}>
        <AddIcon />
      </Fab>


    </div>
  );
};

export default TaskListPage;
