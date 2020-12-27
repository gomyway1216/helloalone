import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../Firebase/blog';
import { TextField, Button } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const RANK_1 = 'rank-1';
const RANK_2 = 'rank-2';
const RANK_3 = 'rank-3';
const RANK_4 = 'rank-4';
const RANK_5 = 'rank-5';
const UNCLASSIFIED = 'unclassified';

const RankingPage = () => {
  const defaultInput = {
    id: '',
    title: '',
    description: '',
    short: ''
  };

  const defaultCategories = {
    'rank-1': {
      name: 'Rank 1',
      items: []
    },
    'rank-2': {
      name: 'Rank 2',
      items: []
    },
    'rank-3': {
      name: 'Rank 3',
      items: []
    },
    'rank-4': {
      name: 'Rank 4',
      items: []
    },
    'rank-5': {
      name: 'Rank 5',
      items: []
    },
    'unclassified': {
      name: 'Unclassified',
      items: []
    }
  };

  const [animeInput, setAnimeInput] = useState(defaultInput);
  const [categorizedAnimeList, setCategorizedAnimeList] = useState(defaultCategories);

  const onAnimeInputChange = e => {
    setAnimeInput({
      ...animeInput,
      [e.target.name]: e.target.value,
    });
  };

  const onAnimeInputSave = () => {
    blogApi.addAnimeItem(animeInput)
      .then(() => {
        blogApi.addCategorizedAnimeItem(UNCLASSIFIED, animeInput)
          .then(() => {
            setAnimeInput(defaultInput);
          })
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

  return (
    <div>
      <div>
        <TextField id="title" name="title" label="Title" value={animeInput.title} onChange={onAnimeInputChange} />
        <TextField id="description" name="description" multiline label="Description" value={animeInput.description} onChange={onAnimeInputChange} />
        <TextField id="short" name="short" label="Short title" value={animeInput.short} onChange={onAnimeInputChange} />
        <Button variant="contained" color="primary" onClick={onAnimeInputSave} >Save </ Button>
      </div>
      <h1>Watched Anime List</h1>
      <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }} >
        <DragDropContext onDragEnd={handleDrag} >
          {Object.entries(categorizedAnimeList).map(([columnId, column]) => (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            key={columnId}>
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId} >
                  { (provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? 'lightblue'
                          : 'lightgrey',
                        padding: 4,
                        width: 250,
                        minHeight: 500
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: 16,
                                margin: '0 0 8px 0',
                                minHeight: '50px',
                                backgroundColor: snapshot.isDragging
                                  ? '#263B4A'
                                  : '#456C86',
                                color: 'white',
                                ...provided.draggableProps.style
                              }}
                            >
                              {item.title}
                            </div>
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
    </div>
  );
};

export default RankingPage;

RankingPage.propTypes = {
  history: PropTypes.object
};