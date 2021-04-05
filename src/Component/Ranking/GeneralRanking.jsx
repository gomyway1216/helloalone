import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../../Firebase/blog';
import { Button, TextField } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DescriptionDialog from '../Dialog/DescriptionDialog';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAuth } from '../../Provider/AuthProvider';

const GeneralRanking = (props) => {
  const { id, tags, rankingItemList, itemList } = props;
  const [dialogItem, setDialogItem] = useState();
  const [dialogRankingItemId, setDialogRankingItemId] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState({name: ''});
  const [inputValue, setInputValue] = useState('');
  const { currentUser } = useAuth();
  const userId = currentUser.uid;

  const handleDrag = (res) => {
    // if the dragging item is in outside of any of the box
    if(!res.destination) {
      return;
    }
    setLoading(true);
    const { source, destination } = res;
    const modifyingItemList = _.cloneDeep(rankingItemList);
    const rankingItemSource = modifyingItemList.filter(e => e.id === source.droppableId)[0];
    const [item] = rankingItemSource.itemList.splice(source.index, 1); 
    const rankingItemDest = modifyingItemList.filter(e => e.id === destination.droppableId)[0];
    rankingItemDest.itemList.splice(destination.index, 0, item);
    blogApi.updateItemListBatch(userId, id, [rankingItemSource, rankingItemDest], setLoading);
  };

  const handleOpenDialog = (rankingItemId, item) => {
    setDialogRankingItemId(rankingItemId);
    setDialogItem(item);
    setDialogOpen(true);
  };

  const onItemInputUpdate = (itemVal) => {
    let tagIds = itemVal.tags.map(tag => tag.id);
    const item = {...itemVal, tags: tagIds};
    blogApi.updateItem(userId, item)
      .then(() => handleCloseDialog())
      .catch(err => console.log(err));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRemoveRank = (rank) => {
    if(rankingItemList[rank-1].itemList.length > 0) {
      // TODO create error modal
      return;
    }
    const modifyingRankingItem = [];
    for(let i = rank; i < rankingItemList.length; i++) {
      rankingItemList[i].rank = rankingItemList[i].rank - 1;
      modifyingRankingItem.push(rankingItemList[i]);
    }
    // this won't get called if the removing list is at the end
    if(modifyingRankingItem.length > 0) {
      blogApi.updateItemListBatch(userId, id, modifyingRankingItem, setLoading);
    }
    blogApi.deleteRankingItem(userId, id, rankingItemList[rank-1].id);
  };

  const handleDeleteFromRanking = () => {
    blogApi.deleteItemFromRanking(userId, id, dialogRankingItemId, dialogItem.id)
      .then(() => handleCloseDialog());
  };

  const addItemToRanking = () => {
    if(!selectValue) {
      return;
    }
    const rankingItemId = rankingItemList[rankingItemList.length-1];
    const AddingItemExistException = {message: 'Adding item already exists!'};
    try {
      rankingItemList.forEach(rankingItem => {
        rankingItem.itemList.forEach(item => {
          if(item.id === selectValue.id) {
            throw AddingItemExistException;
          }
        });
      });
    } catch(e) {
      console.log(e.message);
      return;
    }
    blogApi.addItemToRanking(userId, id, rankingItemId.id, selectValue.id)
      .then(setSelectValue(null));
    // TODO create modal 
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <DragDropContext onDragEnd={handleDrag} >
          {rankingItemList.map((rankingItem, index) => {
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
              }}
              key={rankingItem.id}>
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                  <div style={{fontSize: 20, marginTop: 'auto', marginBottom: 'auto'}}>{rankingItem.rank}</div>
                  <IconButton color="primary" aria-label="remove rank" 
                    component="span" onClick={() => handleRemoveRank(rankingItem.rank)}>
                    <RemoveIcon fontSize="small"/>
                  </IconButton>
                </div> 
                <div style={{ margin: 8 }}>
                  <Droppable direction="horizontal" droppableId={rankingItem.id} key={rankingItem.id} >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          background: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'LavenderBlush',
                          padding: 4,
                          minWidth: 200,
                          minHeight: 50
                        }}
                      >
                        {rankingItem.itemList.map((item, index) => {                        
                          return (      
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
                                      backgroundColor: snapshot.isDragging
                                        ? 'LawnGreen'
                                        : 'FloralWhite',
                                      color: 'blue',
                                      ...provided.draggableProps.style,
                                      borderStyle: 'solid',
                                      borderColor: 'Lavender',
                                      borderRadius: 25
                                    }}
                                    onClick={() => handleOpenDialog(rankingItem.id, item)}
                                  >
                                    {item.name}
                                  </div>
                                </>
                              )}
                            </Draggable>
                          );                          
                        }
                        )}
                        {provided.placeholder}  
                      </div>
                    )}
                  </Droppable>
                </div>               
              </div>
            );
          })}
        </DragDropContext>  
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Autocomplete
            value={selectValue}
            onChange={(selectValue, newValue) => {
              setSelectValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="itemList"
            options={itemList}
            style={{ width: 300 }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Item Name" variant="outlined" />}
          />
          <Button variant="contained" color="primary" onClick={addItemToRanking}>
            Add
          </Button>
        </div>
      </div>
      {dialogOpen && 
        <DescriptionDialog 
          open={dialogOpen} item={dialogItem} onClose={handleCloseDialog} tags={tags} 
          onSave={onItemInputUpdate} partOfRanking={true} onDeleteFromRanking={handleDeleteFromRanking}     
        />
      }
    </>
  );
};

export default GeneralRanking;

GeneralRanking.propTypes = {
  id: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  rankingItemList: PropTypes.array.isRequired,
  itemList: PropTypes.array.isRequired
};
