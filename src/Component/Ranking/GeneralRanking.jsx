import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../../Firebase/blog';
import { TextField, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DescriptionDialog from '../DescriptionDialog';
import * as rankingConstants from './constants';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const VIEW_MODE = 'view_mode';
const EDIT_MODE = 'edit_mode';
const DELETE_MODE = 'delete_mode';
const USER_NAME = 'yyaguchi';

const GeneralRanking = (props) => {
  const { itemName } = props;
  const [itemInput, setItemInput] = useState(rankingConstants.defaultInput);
  const [itemList, setItemList] = useState([]);
  const [rawItemList, setRawItemList] = useState([]);
  const [rankingCount, setRankingCount] = useState(0);
  const [openingDialogId, setOpenDialogId] = useState('');
  const [dialogMode, setDialogMode] = useState();

  const onItemInputChange = e => {
    setItemInput({
      ...itemInput,
      [e.target.name]: e.target.value,
    });
  };

  const onItemInputSave = () => {
    blogApi.addItem(USER_NAME, itemName, itemInput)
      .then(() => setItemInput(rankingConstants.defaultInput))
      .catch(err => console.log(err));
  };

  const onItemInputUpdate = (item) => {
    blogApi.updateItem(USER_NAME, itemName, item)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  const onItemDelete = () => {
    blogApi.deleteItem(USER_NAME, itemName, openingDialogId)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  // TODO: find better way instead of creating list every time or prevent recreating non-modified list
  useEffect(() => {
    blogApi.streamItemList(USER_NAME, itemName, {
      next: querySnapshot => {
        const updateItems = querySnapshot.docs.map(docSnapShot => (
          { id: docSnapShot.id, ...docSnapShot.data()}
        ));
        setRawItemList(updateItems);
        const categorizedList = [];
        for(let i = 0; i < rankingCount; i++) {
          const categorizedItem = {
            category: i.toString(),
            list: []
          };
          categorizedList.push(categorizedItem);
        }
        updateItems.map(item => {
          const categorizedItemArray = categorizedList.filter(e => e.category === item.category);
          if(categorizedItemArray.length > 0) {
            categorizedItemArray[0].list.push(item);
          } else {
            const list = [];
            list.push(item);
            const categorizedItem = {
              category: item.category,
              list
            };
            categorizedList.push(categorizedItem);
          }
        });

        categorizedList.forEach(categorizedItem => categorizedItem.list.sort((a, b) => a.order - b.order));
        categorizedList.sort((a, b) => a.category - b.category);
        setItemList(categorizedList);
      },
      error: () => console.log('error')
    });
  }, [rankingCount]);

  useEffect(() => {
    blogApi.streamRankCount(USER_NAME, itemName, (doc) => {
      if(doc && doc.exists && !isNaN(doc.data().rankingCount)) {
        setRankingCount(doc.data().rankingCount);
      }
    });
  }, [setRankingCount]);

  const removeItemFromSource = (category, index) => {
    const categorizedItem = itemList.filter(e => e.category === category)[0];
    const [item] = categorizedItem.list.splice(index, 1);
    for(let i = index; i < categorizedItem.list.length; i++) {
      categorizedItem.list[i].order = categorizedItem.list[i].order - 1;
      blogApi.updateItem(USER_NAME, itemName, categorizedItem.list[i]);
    }
    return item;
  };

  const addItemToDest = (category, index, item) => {
    const categorizedItem = itemList.filter(e => e.category === category)[0];
    for(let i = index; i < categorizedItem.list.length; i++) {
      categorizedItem.list[i].order = categorizedItem.list[i].order + 1;
      blogApi.updateItem(USER_NAME, itemName, categorizedItem.list[i]);
    }
    item.order = index;
    item.category = category;
    blogApi.updateItem(USER_NAME, itemName, item);
    categorizedItem.list.splice(index, 0, item);
  };

  const handleDrag = (res) => {
    if(!res.destination) {
      return;
    }
    const { source, destination } = res;
    const item = removeItemFromSource(source.droppableId, source.index);
    addItemToDest(destination.droppableId, destination.index, item);
  };

  const handleOpenDialog = (id, mode) => {
    setOpenDialogId(id);
    setDialogMode(mode);
  };

  const handleCloseDialog = () => {
    setOpenDialogId('');
    setDialogMode('');
  };

  const handleAddRank = () => {
    blogApi.setRankingCount(USER_NAME, itemName, rankingCount+1);
  };

  const handleRemoveRank = (category) => {
    if(itemList[parseInt(category)].list.length > 0) {
      // TODO create error modal
      console.log('the removing rank has items!');
      return;
    }
    for(let i = parseInt(category) + 1; i < rankingCount; i++) {
      const categorizedItem = itemList[i];
      for(let j = 0; j < categorizedItem.list.length; j++) {
        categorizedItem.list[j].category = (parseInt(categorizedItem.list[j].category) - 1).toString();
        blogApi.updateItem(USER_NAME, itemName, categorizedItem.list[j]);
      }
    }
    blogApi.setRankingCount(USER_NAME, itemName, rankingCount - 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <h1>Watched {itemName} List</h1>
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="add rank" 
            component="span" style={{ top: '10%'}} onClick={handleAddRank}>
            <AddIcon fontSize="large"/>
          </IconButton>
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }} >
        <DragDropContext onDragEnd={handleDrag} >
          {itemList.map(categorizedList => (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
              overflow: 'auto'
            }}
            key={categorizedList.category}>
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{fontSize: 20, marginTop: 'auto', marginBottom: 'auto'}}>{categorizedList.category}</div>
                <IconButton color="primary" aria-label="remove rank" 
                  component="span" onClick={() => handleRemoveRank(categorizedList.category)}>
                  <RemoveIcon fontSize="small"/>
                </IconButton>
              </div>    
              <div style={{ margin: 8 }}>
                <Droppable direction="horizontal" droppableId={categorizedList.category} key={categorizedList.category} >
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
                      {categorizedList.list.map((item, index) => (
                        
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
          {rawItemList.map((item) => (
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
      {(dialogMode === EDIT_MODE && openingDialogId && rawItemList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={EDIT_MODE} animeObj={rawItemList.find(o => o.id === openingDialogId)} 
          open={dialogMode === EDIT_MODE} onClose={handleCloseDialog} onSave={onItemInputUpdate}/>}
      {(dialogMode === DELETE_MODE && openingDialogId && rawItemList.find(o => o.id === openingDialogId)) && 
        <DescriptionDialog dialogMode={DELETE_MODE} animeObj={rawItemList.find(o => o.id === openingDialogId)} 
          open={dialogMode === DELETE_MODE} onClose={handleCloseDialog} onDelete={onItemDelete}/>}
    </div>
  );
};

export default GeneralRanking;

GeneralRanking.propTypes = {
  itemName: PropTypes.string.isRequired,
};