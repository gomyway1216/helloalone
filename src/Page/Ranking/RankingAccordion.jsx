import React, { useEffect, useState } from 'react';
import GeneralRanking from '../../Component/Ranking/GeneralRanking';
import { Accordion, AccordionSummary, AccordionDetails, IconButton, 
  Menu, MenuItem, FormControlLabel, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as blogApi from '../../Firebase/blog';
import { Backdrop, CircularProgress } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import EditRankingNameDialog from '../../Component/Dialog/EditRankingNameDialog';
import { useAuth } from '../../Provider/AuthProvider';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 5,
    color: '#fff',
  },
}));

const RankingAccordion = (props) => {
  const { id, name, tags } = props;
  const [loading, setLoading] = useState(false);
  const [rankingItemList, setRankingItemList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();
  const { currentUser } = useAuth();
  const userId = currentUser.uid;


  const bigList = async (doc, nestedList, length) => {
    const document = doc.data();
    for(let j = 0; j < document.itemList.length; j++) {
      const value = await blogApi.getItemById(userId, document.itemList[j]);
      document.itemList[j] = value;
    }
    nestedList.push({ id: doc.id, ...document });
    if(nestedList.length === length) {
      nestedList.sort((a, b) => a.rank - b.rank);
      setRankingItemList(nestedList);
      setLoading(false);
    }
  };

  useEffect(() => {
    blogApi.streamRankingItemList(userId, id, {
      next: querySnapshot => {
        if(querySnapshot.size === 0) {
          return;
        }
        setLoading(true);   
        const nestedList = [];
        querySnapshot.forEach((doc) => {
          bigList(doc, nestedList, querySnapshot.size);     
        });
      },
      error: () => {
        setLoading(false);
        console.log('error');
      }
    });
  }, [itemList]);

  useEffect(() => {
    blogApi.streamItemList(userId, 'itemCollection', {
      next: querySnapshot => {
       
        setLoading(true);
        const updateItems = querySnapshot.docs.map(docSnapShot => (
          {id: docSnapShot.id, ...docSnapShot.data()}
        ));
        
        setItemList(updateItems);
        setLoading(false);

      }
    });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpanded = (event, isExpanded) => {
    setExpanded(!expanded);
  };

  const options = [
    { id: 'editTitle', name: 'Edit Title'},
    { id: 'addNewRank', name: 'Add new rank'},
    { id: 'deleteRank', name: 'Delete this rank'}
  ];

  const handleMenuClick = (clickedId) => () => {
    if(clickedId === 'addNewRank') {
      handleAddRank();
    } else if(clickedId === 'editTitle') {
      setDialogOpen(true);
    } else if(clickedId === 'deleteRank') {
      blogApi.deleteRanking(userId, id);
    }
    handleClose();
  };

  const handleAddRank = () => {
    setLoading(true);
    blogApi.createRankingItem(userId, id, rankingItemList.length + 1);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleEdiRanking = (ranking) => () => {
    blogApi.updateRankingTitle(userId, ranking)
      .then(() => handleCloseDialog());
  };

  return (
    <>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Accordion expanded={expanded} onChange={handleExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography align='center' style={{ width: '100%', fontSize: 'x-large', display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center' }}>{name}</Typography>
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={ 
              <>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: '20ch',
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.id} onClick={handleMenuClick(option.id)}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            }
          />
        </AccordionSummary>
        <AccordionDetails>
          <GeneralRanking id={id} tags={tags} rankingItemList={rankingItemList} itemList={itemList} />
        </AccordionDetails>
      </Accordion>
      {dialogOpen && 
        <EditRankingNameDialog 
          open={dialogOpen} onClose={handleCloseDialog} onSave={handleEdiRanking} ranking={{id, name}}/>
      }
    </>
  );
};

export default RankingAccordion;

RankingAccordion.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired
};