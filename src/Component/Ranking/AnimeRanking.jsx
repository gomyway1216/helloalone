import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../../Firebase/blog';
import { TextField, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DescriptionDialog from '../DescriptionDialog';
import * as rankingConstants from './constants';

const RANK_1 = 'rank-1';
const RANK_2 = 'rank-2';
const RANK_3 = 'rank-3';
const RANK_4 = 'rank-4';
const RANK_5 = 'rank-5';
const UNCLASSIFIED = 'unclassified';
const VIEW_MODE = 'view_mode';
const EDIT_MODE = 'edit_mode';
const DELETE_MODE = 'delete_mode';

const AnimeRanking = () => {
  const [animeInput, setAnimeInput] = useState(rankingConstants.defaultInput);
  const [animeList, setAnimeList] = useState([]);
  const [categorizedAnimeList, setCategorizedAnimeList] = useState(rankingConstants.defaultCategories);
  const [openingDialogId, setOpenDialogId] = useState('');
  const [dialogMode, setDialogMode] = useState();

  const onAnimeInputChange = e => {
    setAnimeInput({
      ...animeInput,
      [e.target.name]: e.target.value,
    });
  };

  const onAnimeInputSave = () => {
    blogApi.addAnimeItem(animeInput)
      .then(id => {
        const inputWithId = {
          ...animeInput,
          originalId: id
        };
        blogApi.addCategorizedAnimeItem(UNCLASSIFIED, inputWithId)
          .then(() => {
            setAnimeInput(rankingConstants.defaultInput);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const onAnimeInputUpdate = (item) => {
    let collectionId;
    let itemId;
    for (const key in categorizedAnimeList) {
      const pair = categorizedAnimeList[key];
      const foundItem = pair.items.find(o => o.originalId === openingDialogId);
      if(foundItem) {
        collectionId = key;
        itemId = foundItem.id;
        break;
      }
    }

    blogApi.updateAnimeItem(item)
      .then(() => {
        item.id = itemId;
        blogApi.updateCategorizedAnimeItem(collectionId, item)
          .then(() => handleCloseDialog())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const onAnimeItemDelete = () => {
    let collectionId;
    let itemId;
    for (const key in categorizedAnimeList) {
      const pair = categorizedAnimeList[key];
      const foundItem = pair.items.find(o => o.originalId === openingDialogId);
      if(foundItem) {
        collectionId = key;
        itemId = foundItem.id;
        break;
      }
    }

    blogApi.deletedAnimeItem(openingDialogId)
      .then(() => {
        blogApi.deleteCategorizedAnimeItem(collectionId, itemId)
          .then(() => handleCloseDialog())
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (category, id) => {
    blogApi.deleteCategorizedAnimeItem(category, id)
      .catch(err => console.log(err));
  };

  const handleAppend = (category, item) => {
    blogApi.addCategorizedAnimeItem(category, item)
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const unsubscribe = blogApi.streamAnimeList({
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => {
          return { id: docSnapShot.id, ...docSnapShot.data()};
        });
        setAnimeList(updateAnimeItems);
      },
      error: () => console.log('error')
    });
    return unsubscribe;
  }, [setAnimeList]);

  useEffect(() => {
    blogApi.streamCategorizedAnimeList(UNCLASSIFIED, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[UNCLASSIFIED];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [UNCLASSIFIED]: val
        });
      },
      error: () => console.log('error')
    });

    blogApi.streamCategorizedAnimeList(RANK_1, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[RANK_1];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [RANK_1]: val
        });
      },
      error: () => console.log('error')
    });

    blogApi.streamCategorizedAnimeList(RANK_2, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[RANK_2];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [RANK_2]: val
        });
      },
      error: () => console.log('error')
    });

    blogApi.streamCategorizedAnimeList(RANK_3, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[RANK_3];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [RANK_3]: val
        });
      },
      error: () => console.log('error')
    });

    blogApi.streamCategorizedAnimeList(RANK_4, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[RANK_4];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [RANK_4]: val
        });
      },
      error: () => console.log('error')
    });

    blogApi.streamCategorizedAnimeList(RANK_5, {
      next: querySnapshot => {
        const updateAnimeItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedAnimeList[RANK_5];
        val.items = updateAnimeItems;
        setCategorizedAnimeList({
          ...categorizedAnimeList,
          [RANK_5]: val
        });
      },
      error: () => console.log('error')
    });
  }, [setCategorizedAnimeList]);

  const handleDrag = (res) => {
    if(!res.destination) {
      return;
    }
    const { source, destination } = res;
    // check if the previous list equals the destination list
    // if the destination list is different from the previous list
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = categorizedAnimeList[source.droppableId];
      const destColumn = categorizedAnimeList[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setCategorizedAnimeList({
        ...categorizedAnimeList,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
      handleDelete(source.droppableId, sourceColumn.items[source.index].id);
      handleAppend(destination.droppableId, sourceColumn.items[source.index]);

    } else {
      const column = categorizedAnimeList[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setCategorizedAnimeList({
        ...categorizedAnimeList,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const handleOpenDialog = (id, mode) => {
    setOpenDialogId(id);
    setDialogMode(mode);
  };

  const handleCloseDialog = () => {
    setOpenDialogId('');
    setDialogMode('');
  };

  return (
    <div>
      <h1>Watched Anime List</h1>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }} >
        <DragDropContext onDragEnd={handleDrag} >
          {Object.entries(categorizedAnimeList).map(([columnId, column]) => (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
              overflow: 'auto'
            }}
            key={columnId}>
              <div style={{fontSize: 20}}>{column.name}</div>
              <div style={{ margin: 8 }}>
                <Droppable direction="horizontal" droppableId={columnId} key={columnId} >
                  { (provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        // overflow: 'auto',
                        flexWrap: 'wrap',
                        background: snapshot.isDraggingOver
                          ? 'lightblue'
                          : 'LavenderBlush',
                        padding: 4,
                        // width: 250,
                        minWidth: 200,
                        minHeight: 50
                      }}
                    >
                      {column.items.map((item, index) => (
                        
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: 'none',
                                  padding: 8,
                                  margin: '0 0 8px 0',
                                  // minHeight: '10px',
                                  backgroundColor: snapshot.isDragging
                                    ? 'LawnGreen'
                                    : 'FloralWhite',
                                  color: 'blue',
                                  ...provided.draggableProps.style,
                                  borderStyle: 'solid',
                                  borderColor: 'Lavender',
                                  borderRadius: 25
                                }}
                                onClick={() => handleOpenDialog(item.id, VIEW_MODE)}
                              >
                                {item.title}
                              </div>
                              <DescriptionDialog id={item.id} dialogMode={VIEW_MODE} 
                                open={openingDialogId === item.id && dialogMode === VIEW_MODE} 
                                animeObj={item} onClose={handleCloseDialog} />
                            </>
                          )}
                        </Draggable>
                      )
                      )}
                      {provided.placeholder}  
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          )
          )}
        </DragDropContext>  
      </div>
      <div>
        <h1>Add Anime</h1>
        <TextField id="title" name="title" label="Title" value={animeInput.title} onChange={onAnimeInputChange} />
        <TextField id="description" name="description" multiline label="Description" 
          value={animeInput.description} onChange={onAnimeInputChange} />
        <TextField id="short" name="short" label="Short title" value={animeInput.short} onChange={onAnimeInputChange} />
        <Button variant="contained" color="primary" onClick={onAnimeInputSave} >Save</ Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <List component="nav" style={{ maxHeight: 500, width: 400, overflow: 'auto'}}>
          {animeList.map((animeItem) => (
            <ListItem button key={animeItem.id} style={{ background: openingDialogId === animeItem.id 
              ? 'Cyan'
              : 'AliceBlue'}} 
            onClick={() => setOpenDialogId(animeItem.id)}>
              <ListItemText primary={animeItem.title} />
            </ListItem>
          ))}
        </List>
        <div style={{margin: 30}}>
          <Button variant="contained" color="primary" onClick={() => setDialogMode(EDIT_MODE)} style={{margin: 20}}>Edit</ Button>
          <Button variant="contained" color="secondary" onClick={() => setDialogMode(DELETE_MODE)}>Delete</ Button>
        </div>
      </div>
      {(dialogMode === EDIT_MODE && openingDialogId && animeList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={EDIT_MODE} animeObj={animeList.find(o => o.id === openingDialogId)} 
          open={dialogMode === EDIT_MODE} onClose={handleCloseDialog} onSave={onAnimeInputUpdate}/>}
      {(dialogMode === DELETE_MODE && openingDialogId && animeList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={DELETE_MODE} animeObj={animeList.find(o => o.id === openingDialogId)} 
          open={dialogMode === DELETE_MODE} onClose={handleCloseDialog} onDelete={onAnimeItemDelete}/>}
    </div>
  );
};

export default AnimeRanking;

AnimeRanking.propTypes = {
  history: PropTypes.object
};