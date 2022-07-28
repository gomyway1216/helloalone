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
      console.log('response for insertActivityCategory', response);
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
    console.log('response for insertActivityCategory', response);
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
      console.log('response for insertActivityType', response);
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
    console.log('response for insertActivityType', response);
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