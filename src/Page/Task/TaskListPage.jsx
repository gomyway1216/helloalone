import React, { useState, useEffect } from 'react';
import * as taskApi from '../../Firebase/task';
import TaskCard from '../../Component/Task/TaskCard';
import { useAuth } from '../../Provider/AuthProvider';

const TaskListPage = () => {
  const [taskList, setTaskList] = useState();
  const [dailyTask, setDailyTask] = useState();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  const getTaskList = async () => {
    const taskList = await taskApi.getTaskList(userId);
    setTaskList(taskList);
  }; 

  const getDailyTask = async () => {
    const dailyTask = await taskApi.getDailyTask(userId);
    setDailyTask(dailyTask);
  };

  useEffect(() => {
    getTaskList();
  }, []);

  useEffect(() => {
    getDailyTask();
  }, []);

  return (
    <div>
      <div>Task List</div>
      {taskList && taskList.map(task => (
        <div key={task.id}>
          <div>{task.value.name}</div>
          <div>{task.value.description}</div>
          <div>{task.value.duration}</div>
        </div>
      ))
      }
      <div>Daily Task</div>
      {!dailyTask &&
        <div>Create Daily Task</div>
      }
      {dailyTask && Object.keys(dailyTask.value.taskList)
        .map(key => <TaskCard key={key} id={key} duration={dailyTask.value.taskList[key]} />)
      }
    </div>
  );
};

export default TaskListPage;