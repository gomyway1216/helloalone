import React, { useEffect, useState } from 'react';
import * as animeApi from '../../Firebase/anime';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ItemCard from '../../Component/Anime/ItemCard';
import './anime-page.scss';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ALPHANUMERICAL = 'ALPHANUMERIC';
const SCORE_HIGH_TO_LOW = 'SCORE_HIGH_TO_LOW';
const SCORE_LOW_TO_HIGH = 'SCORE_LOW_TO_HIGH';
const UPDATED_NEW_TO_OLD = 'UPDATED_NEW_TO_OLD';
const UPDATED_OLD_TO_NEW = 'UPDATED_OLD_TO_NEW';

const AnimePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState({name: ''});
  const [inputValue, setInputValue] = useState('');
  const [itemList, setItemList] = useState([]);
  itemList.sort((a, b) => a.name > b.name ? 1 : -1);
  const [filteredItemList, setFilteredItemList] = useState(itemList);
  const [orderBy, setOrderBy] = useState(ALPHANUMERICAL);
  const classes = useStyles();

  const handleOrderChange = (event) => {
    setOrderBy(event.target.value);
  };

  const getAnimeList = async () => {
    setLoading(true);
    const list = await animeApi.getAnimeItemList();
    setItemList(list);
    setFilteredItemList(list);
    setLoading(false);
  };

  useEffect(() => {
    getAnimeList();
  }, []);

  useEffect(() => {
    const filtered = itemList.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()));
    if(orderBy === ALPHANUMERICAL) {
      setFilteredItemList(filtered.sort((a, b) => a.name > b.name ? 1 : -1));
    } else if(orderBy === SCORE_HIGH_TO_LOW) {
      setFilteredItemList(filtered.sort((a, b) => a.score > b.score ? -1 : 1));
    } else if(orderBy === SCORE_LOW_TO_HIGH) {
      setFilteredItemList(filtered.sort((a, b) => a.score > b.score ? 1 : -1));
    } else if(orderBy === UPDATED_NEW_TO_OLD) {
      setFilteredItemList(filtered.sort((a, b) => a.lastUpdated.seconds > b.lastUpdated.seconds ? -1 : 1));
    } else if(orderBy === UPDATED_OLD_TO_NEW) {
      setFilteredItemList(filtered.sort((a, b) => a.lastUpdated.seconds > b.lastUpdated.seconds ? 1 : -1));
    }
    setFilteredItemList(filtered);
  }, [orderBy, inputValue]);

  if(loading) {
    return (
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <div className="title">Anime/Manga List</div>
      <div className="search">
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
          style={{ width: 500 }}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
          freeSolo={true}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="orderby-select-label">Order By</InputLabel>
          <Select
            labelId="orderby-select"
            id="orderby-select"
            value={orderBy}
            onChange={handleOrderChange}
          >
            <MenuItem value={ALPHANUMERICAL}>Alphanumerical</MenuItem>
            <MenuItem value={SCORE_HIGH_TO_LOW}>Score: High to Low</MenuItem>
            <MenuItem value={SCORE_LOW_TO_HIGH}>Score: Low to High</MenuItem>
            <MenuItem value={UPDATED_NEW_TO_OLD}>Updated: Latest</MenuItem>
            <MenuItem value={UPDATED_OLD_TO_NEW}>Updated: Oldest</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="item-list">
        {filteredItemList && filteredItemList.map(item => 
          <ItemCard key={item.id} item={item} />
        )}
      </div>
    </div>
  );
};

export default AnimePage;