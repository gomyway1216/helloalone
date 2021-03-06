import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import * as blogApi from '../../Firebase/blog';
import { Backdrop, CircularProgress } from '@material-ui/core';
import ItemListInteract from '../../Component/Ranking/ItemListInteract';
import RankingAccordion from './RankingAccordion';
import CreateRankingDialog from '../../Component/Dialog/CreateRankingDialog';
import { useAuth } from '../../Provider/AuthProvider';

const RankingPage = () => {
  const [loading, setLoading] = useState(false);
  const [rankingMap, setRankingMap] = useState();
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  useEffect(() => {
    blogApi.streamTags(userId, {
      next: querySnapshot => {
        setLoading(true);
        const updateTags = querySnapshot.docs.map(docSnapShot => (
          {id: docSnapShot.id, ...docSnapShot.data()}
        ));
        setTags(updateTags);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    blogApi.streamRankingList(userId, {
      next: querySnapshot => {
        setLoading(true);
        let rankingMap;
        if(querySnapshot.data()) {
          rankingMap = querySnapshot.data().rankingMap;
        }        
        setRankingMap(rankingMap);
        setLoading(false);
      },
      error: () => {
        setLoading(false);
        console.log('error');
      }
    });
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleCreateRanking = (itemName) => () => {
    blogApi.createRanking(userId, itemName)
      .then(() => handleCloseDialog());
  };

  return (
    <div>
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <h1>Ranking</h1>
        <Button variant="contained" style={{margin: '20px'}} onClick={() => setDialogOpen(true)} >Create Ranking</Button>
      </div>
      {rankingMap && Object.keys(rankingMap).map((key, index) => (
        <RankingAccordion key={index} id={key} name={rankingMap[key]} tags={tags}/>
      ))}
      <ItemListInteract tags={tags}/>
      {dialogOpen && 
        <CreateRankingDialog 
          open={dialogOpen} onClose={handleCloseDialog} onSave={handleCreateRanking}/>
      }
    </div>
  );
};

export default RankingPage;