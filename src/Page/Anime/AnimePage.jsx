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

const order_alphanumerical = 'alphanumerical';
const order_score = 'score';

const AnimePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState({name: ''});
  const [inputValue, setInputValue] = useState('');
  const [itemList, setItemList] = useState([]);
  itemList.sort((a, b) => a.name > b.name ? 1 : -1);
  const [filteredItemList, setFilteredItemList] = useState(itemList);
  const [orderBy, setOrderBy] = useState(order_alphanumerical);
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
    if(orderBy === order_alphanumerical) {
      setFilteredItemList(filtered.sort((a, b) => a.name > b.name ? 1 : -1));
    } else if(orderBy === order_score) {
      setFilteredItemList(filtered.sort((a, b) => a.score > b.score ? -1 : 1));
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
          style={{ width: 300 }}
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
            <MenuItem value={order_alphanumerical}>Alphanumerical</MenuItem>
            <MenuItem value={order_score}>Score</MenuItem>
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