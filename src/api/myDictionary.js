import api from './api';

export const getDictionaryEntities = async () => {
  const response = await api.get('/my-dictionary/');
  return response.data;
};

export const getDictionaryEntitiesById = async (dicId) => {
  const response = await api.get('/my-dictionary',
    { params: {
      dictionaryEntryId: dicId
    }}
  );
  return response;
};

export const addDictionaryEntry = async (entry) => {
  return api.post('/my-dictionary/add', entry)
    .then((response) => {
      console.log('response for addDictionaryEntry', response);
      return response.data;
    });
};

export const getTagEntries = async () => {
  const response = await api.get('/my-dictionary/tags/');
  return response.data;
};

export const addTagEntry = async (name) => {
  return api.post('/my-dictionary/add-tag', {name})
    .then((response) => {
      console.log('response for addTagEntry', response);
      return response.data;
    });
};