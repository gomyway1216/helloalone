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

const GeneralRanking = (props) => {
  const { itemName } = props;
  console.log('itemName: ', itemName);
  const [itemInput, setItemInput] = useState(rankingConstants.defaultInput);
  const [itemList, setItemList] = useState([]);
  const [categorizedItemList, setCategorizedItemList] = useState(rankingConstants.defaultCategories);
  const [openingDialogId, setOpenDialogId] = useState('');
  const [dialogMode, setDialogMode] = useState();

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  const onItemInputSave = () => {
    console.log('onSave itemInput: ', itemInput);
    // blogApi.addCategorizedItem(itemName, 'items', itemInput)
    //   .then(id => {
    //     const inputWithId = {
    //       ...itemInput,
    //       originalId: id
    //     };
    //     blogApi.addCategorizedItem(itemName, UNCLASSIFIED, inputWithId)
    //       .then(() => {
    //         setItemInput(rankingConstants.defaultInput);
    //       })
    //       .catch(err => console.log(err));
    //   })
    //   .catch(err => console.log(err));

    blogApi.addCategorizedItem(itemName, UNCLASSIFIED, itemInput)
      .then(() => setItemInput(rankingConstants.defaultInput))
      .catch(err => console.log(err));
  };

  const onItemInputUpdate = (item) => {
    // let collectionId;
    // let itemId;
    // for (const key in categorizedItemList) {
    //   const pair = categorizedItemList[key];
    //   const foundItem = pair.items.find(o => o.originalId === openingDialogId);
    //   if(foundItem) {
    //     collectionId = key;
    //     itemId = foundItem.id;
    //     break;
    //   }
    // }

    // blogApi.updateCategorizedItem(itemName, 'items', item)
    //   .then(() => {
    //     item.id = itemId;
    //     blogApi.updateCategorizedItem(itemName, collectionId, item)
    //       .then(() => handleCloseDialog())
    //       .catch(err => console.log(err));
    //   })
    //   .catch(err => console.log(err));

    blogApi.updateCategorizedItem(itemName, collectionId, item)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  const onItemDelete = () => {
    // let collectionId;
    // let itemId;
    // for (const key in categorizedItemList) {
    //   const pair = categorizedItemList[key];
    //   const foundItem = pair.items.find(o => o.originalId === openingDialogId);
    //   if(foundItem) {
    //     collectionId = key;
    //     itemId = foundItem.id;
    //     break;
    //   }
    // }

    // blogApi.deleteCategorizedItem(itemName, 'items', openingDialogId)
    //   .then(() => {
    //     blogApi.deleteCategorizedItem(itemName, collectionId, itemId)
    //       .then(() => handleCloseDialog())
    //       .catch(err => console.log(err));
    //   })
    //   .catch(err => console.log(err));

    blogApi.deleteCategorizedItem(itemName, collectionId, openingDialogId)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  const handleAppend = (category, item) => {
    blogApi.addCategorizedItem(itemName, category, item)
      .catch(err => console.log(err));
  };

  const handleDelete = (category, id) => {
    console.log('itemName, category, id', itemName, category, id);
    blogApi.deleteCategorizedItem(itemName, category, id)
      .catch(err => console.log(err));
  };

  // useEffect(() => {
  //   const unsubscribe = blogApi.streamCategorizedItemList(itemName, 'items', {
  //     next: querySnapshot => {
  //       const updateItems = 
  //       querySnapshot.docs.map(docSnapShot => {
  //         return { id: docSnapShot.id, ...docSnapShot.data()};
  //       });
  //       setItemList(updateItems);
  //     },
  //     error: () => console.log('error')
  //   });
  //   return unsubscribe;
  // }, [setItemList]);

  useEffect(() => {
    let tempList = [];
    blogApi.streamCategorizedItemList(itemName, UNCLASSIFIED, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[UNCLASSIFIED];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        setCategorizedItemList({
          ...categorizedItemList,
          [UNCLASSIFIED]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 1', tempList);
    blogApi.streamCategorizedItemList(itemName, RANK_1, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[RANK_1];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        setCategorizedItemList({
          ...categorizedItemList,
          [RANK_1]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 2', tempList);
    blogApi.streamCategorizedItemList(itemName, RANK_2, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[RANK_2];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        setCategorizedItemList({
          ...categorizedItemList,
          [RANK_2]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 3', tempList);
    blogApi.streamCategorizedItemList(itemName, RANK_3, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[RANK_3];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        setCategorizedItemList({
          ...categorizedItemList,
          [RANK_3]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 4', tempList);
    blogApi.streamCategorizedItemList(itemName, RANK_4, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[RANK_4];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        setCategorizedItemList({
          ...categorizedItemList,
          [RANK_4]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 5', tempList);
    blogApi.streamCategorizedItemList(itemName, RANK_5, {
      next: querySnapshot => {
        const updateItems = 
        querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        let val = categorizedItemList[RANK_5];
        val.items = updateItems;
        tempList = tempList.concat(updateItems);
        console.log('updateItems 5', updateItems, tempList);
        setCategorizedItemList({
          ...categorizedItemList,
          [RANK_5]: val
        });
      },
      error: () => console.log('error')
    });
    console.log('tempList 6', tempList);
    setItemList(tempList);
  }, [setCategorizedItemList]);

  console.log('itemList', itemList);
  const handleDrag = (res) => {
    if(!res.destination) {
      return;
    }
    const { source, destination } = res;
    // check if the previous list equals the destination list
    // if the destination list is different from the previous list
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = categorizedItemList[source.droppableId];
      const destColumn = categorizedItemList[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setCategorizedItemList({
        ...categorizedItemList,
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
      const column = categorizedItemList[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setCategorizedItemList({
        ...categorizedItemList,
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
      <h1>Watched {itemName} List</h1>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }} >
        <DragDropContext onDragEnd={handleDrag} >
          {Object.entries(categorizedItemList).map(([columnId, column]) => (
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
        <h1>Add {props.itemName}</h1>
        <TextField id="title" name="title" label="Title" value={itemInput.title} onChange={onItemInputChange} />
        <TextField id="description" name="description" multiline label="Description" 
          value={itemInput.description} onChange={onItemInputChange} />
        <TextField id="short" name="short" label="Short title" value={itemInput.short} onChange={onItemInputChange} />
        <Button variant="contained" color="primary" onClick={onItemInputSave} >Save</ Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <List component="nav" style={{ maxHeight: 500, width: 400, overflow: 'auto'}}>
          {itemList.map((item) => (
            <ListItem button key={item.id} style={{ background: openingDialogId === item.id 
              ? 'Cyan'
              : 'AliceBlue'}} 
            onClick={() => setOpenDialogId(item.id)}>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        <div style={{margin: 30}}>
          <Button variant="contained" color="primary" onClick={() => setDialogMode(EDIT_MODE)} style={{margin: 20}}>Edit</ Button>
          <Button variant="contained" color="secondary" onClick={() => setDialogMode(DELETE_MODE)}>Delete</ Button>
        </div>
      </div>
      {(dialogMode === EDIT_MODE && openingDialogId && itemList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={EDIT_MODE} animeObj={itemList.find(o => o.id === openingDialogId)} 
          open={dialogMode === EDIT_MODE} onClose={handleCloseDialog} onSave={onItemInputUpdate}/>}
      {(dialogMode === DELETE_MODE && openingDialogId && itemList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={DELETE_MODE} animeObj={itemList.find(o => o.id === openingDialogId)} 
          open={dialogMode === DELETE_MODE} onClose={handleCloseDialog} onDelete={onItemDelete}/>}
    </div>
  );
};

export default GeneralRanking;

GeneralRanking.propTypes = {
  itemName: PropTypes.string.isRequired,
};