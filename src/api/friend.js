import api from './api';

export const getActivityCategories = async () => {
  const response = await api.get('/activity-category/');
  return response.data;
};

export const getActivityCategory = async (id) => {
  const response = await api.get('/activity-category',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const insertActivityCategory = async (entry) => {
  return api.post('/activity-category/', entry)
    .then((response) => {
      return response.data;
    });
};

export const updateActivityCategory = async (entry) => {
  return api.put('/activity-category', entry,
    {
      params: {
        id
      }
    }).then((response) => {
    return response.data;
  });
};

export const deleteActivityCategory = async (id) => {
  const response = api.delete('/activity-category',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const getActivityTypes = async () => {
  const response = await api.get('/activity-type/');
  return response.data;
};

export const getActivityType = async (id) => {
  const response = await api.get('/activity-type',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const insertActivityType = async (entry) => {
  return api.post('/activity-type/', entry)
    .then((response) => {
      return response.data;
    });
};

export const updateActivityType = async (entry) => {
  return api.put('/activity-type', entry,
    {
      params: {
        id
      }
    }).then((response) => {
    return response.data;
  });
};

export const deleteActivityType = async (id) => {
  const response = api.delete('/activity-type',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const getFriends = async () => {
  const response = await api.get('/friend-tracker/');
  return response.data;
};

export const getFriend = async (id) => {
  const response = await api.get('/friend-tracker',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const insertFriend = async (entry) => {
  return api.post('/friend-tracker/', entry)
    .then((response) => {
      return response.data;
    });
};

export const updateFriend = async (entry) => {
  return api.put('/friend-tracker', entry,
    {
      params: {
        id
      }
    }).then((response) => {
    return response.data;
  });
};

export const deleteFriend = async (id) => {
  const response = api.delete('/friend-tracker',
    {
      params: {
        id
      }
    }
  );
  return response;
};

export const getColleges = async () => {
  const response = await api.get('/college/');
  return response.data;
};

export const getCollege = async (id) => {
  const response = await api.get('/college/',
    {
      params: {
        id
      }
    });
  return response;
};

export const insertCollege = async (entry) => {
  return api.post('/college/', entry)
    .then((response) => {
      return response.data;
    }); 
};

export const updateCollege = async (entry) => {
  return api.put('/college', entry,
    {
      params: {
        id
      }
    }).then((response) => {
    return response.data;
  });
};

export const deleteCollege = async (id) => {
  const response = api.delete('/college',
    {
      params: {
        id
      }
    }
  );
  return response;
};