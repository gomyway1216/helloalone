import api from './api';


export const getFriends = async () => {
  const response = await api.get('/friends/all');
  return response.data;
};

export const getFriendById = async (friendId) => {
  const response = await api.get('/friends/friend', { params: { friendId: friendId }});
  return response.data;
};