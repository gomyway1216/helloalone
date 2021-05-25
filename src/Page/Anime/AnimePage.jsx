import React, { useEffect, useState } from 'react';
import * as animeApi from '../../Firebase/anime';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import ItemCard from '../../Component/Anime/ItemCard';
import './anime-page.scss';

const AnimePage = () => {
  const [selectValue, setSelectValue] = useState({name: ''});
  const [inputValue, setInputValue] = useState('');
  const [itemList, setItemList] = useState([]);
  itemList.sort((a, b) => a.name > b.name ? 1 : -1);
  const [filteredItemList, setFilteredItemList] = useState(itemList);

  const getAnimeList = async () => {
    const list = await animeApi.getAnimeItemList();
    setItemList(list);
    setFilteredItemList(list);
  };

  useEffect(() => {
    getAnimeList();
  }, []);

  useEffect(() => {
    const filtered = itemList.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()));
    setFilteredItemList(filtered);
  }, [inputValue]);

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
        />
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