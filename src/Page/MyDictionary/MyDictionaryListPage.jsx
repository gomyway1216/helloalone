import React, { useEffect, useState } from 'react';
import { getDictionaryEntities } from '../../api/myDictionary';

const MyDictionaryListPage = () => {
  const [loading, setLoading] = useState(true);
  const [dictionaryEntryList, setDictionaryEntryList] = useState([]);

  const getDictionaryEntryList = async () => {
    setLoading(true);
    const entries = await getDictionaryEntities();
    setDictionaryEntryList(entries);
    setLoading(false);
  };

  useEffect(() => {
    getDictionaryEntryList();
  }, []);

  return (
    <div>
      <h1>Dictionary Entry List</h1>
      <div>
        <div>
          {dictionaryEntryList.map((entry) => 
            <div key={entry.id}>{entry.title}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDictionaryListPage;