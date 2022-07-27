import React from 'react';
import { useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { getDictionaryEntitiesById } from '../../api/myDictionary';

const MyDictionaryPage = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [dictionaryEntry, setDictionaryEntry] = useState({});

  const getDictionaryEntry = async () => {
    setLoading(true);
    const entry = await getDictionaryEntitiesById(id);
    setDictionaryEntry(entry);
    setLoading(false);
  };

  useEffect(() => {
    getDictionaryEntry();
  }, []);

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <h1>{dictionaryEntry.title}</h1>
      <div>
        <div>{dictionaryEntry.title_japanese}</div>
        {dictionaryEntry.tags && dictionaryEntry.tags.map((tag) =>
          <div key={tag.id}>
            {tag.name}
          </div>
        )}
        <div>{dictionaryEntry.description}</div>
        <div>{dictionaryEntry.priority}</div>
        <div>{dictionaryEntry.created}</div>
        <div>{dictionaryEntry.lastUpdated}</div>
      </div>
    </div>
  );
};

export default MyDictionaryPage;