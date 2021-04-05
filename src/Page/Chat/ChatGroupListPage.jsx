import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Provider/AuthProvider';
import * as chatApi from '../..//Firebase/chat';
import ChatGroupCard from '../../Component/Chat/ChatGroupCard';


const ChatGroupListPage = () => {
  const { currentUser } = useAuth();
  const [chatGroupList, setChatGroupList] = useState([]);

  const getChatGroupList = async () => {
    const result = await chatApi.getChatGroupList();
    setChatGroupList(result);
  };


  useEffect(() => {
    getChatGroupList();
  }, []);

  return (
    <div className="chat-group-container">
      <h1>Chat Group List</h1>
      {chatGroupList && chatGroupList.map(chatGroup =>
        <ChatGroupCard key={chatGroup.id} chatGroup={chatGroup} />
      )}
    </div>
  );
};

export default ChatGroupListPage;