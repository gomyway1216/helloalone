import React, { useEffect, useState } from 'react';
import * as voiceActorApi from '../../Firebase/voiceActor';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import ItemCard from '../../Component/VoiceActor/ItemCard';
import styles from './voice-actor-list-page.module.scss';
import { filterItem } from '../../util/util';

const ALPHANUMERICAL = 'ALPHANUMERIC';
const UPDATED_NEW_TO_OLD = 'UPDATED_NEW_TO_OLD';
const UPDATED_OLD_TO_NEW = 'UPDATED_OLD_TO_NEW';
const GOJUON_JUN = 'GOJUON_JUN';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const VoiceActorListPage = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const name = location && location.state ? location.state.name : '';
  const [selectValue, setSelectValue] = useState({option: name});
  const [inputValue, setInputValue] = useState('');
  const [itemList, setItemList] = useState([]);
  itemList.sort((a, b) => a.name_english > b.name_english ? 1 : -1);
  const [filteredItemList, setFilteredItemList] = useState(itemList);
  const [orderBy, setOrderBy] = useState(ALPHANUMERICAL);

  const handleOrderChange = (event) => {
    setOrderBy(event.target.value);
  };

  const getVoiceActorList = async () => {
    setLoading(true);
    const list = await voiceActorApi.getVoiceActorList();
    setItemList(list);
    if(name) {
      const filtered = filterItem(name, list);
      setFilteredItemList(filtered);
    } else {
      setFilteredItemList(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    getVoiceActorList();
  }, []);

  useEffect(() => {
    const filtered = filterItem(inputValue, itemList);
    if(orderBy === ALPHANUMERICAL) {
      setFilteredItemList(filtered.sort((a, b) => a.name_english > b.name_english ? 1 : -1));
    } else if(orderBy === UPDATED_NEW_TO_OLD) {
      setFilteredItemList(filtered.sort((a, b) => a.lastUpdated.seconds > b.lastUpdated.seconds ? -1 : 1));
    } else if(orderBy === UPDATED_OLD_TO_NEW) {
      setFilteredItemList(filtered.sort((a, b) => a.lastUpdated.seconds > b.lastUpdated.seconds ? 1 : -1));
    } else if(orderBy === GOJUON_JUN) {
      setFilteredItemList(filtered.sort((a, b) => a.name_japanese_ruby > b.name_japanese_ruby ? 1 : -1));
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
      <div className={styles.titleWrapper}>
        <div className={styles.title}>Anime/Manga List</div>
      </div>
      <div className={styles.search}>
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
          getOptionLabel={(option) => option.name_english ? (option.name_english + ' / ' + option.name_japanese) : ''}
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
            <MenuItem value={UPDATED_NEW_TO_OLD}>Updated: Latest</MenuItem>
            <MenuItem value={UPDATED_OLD_TO_NEW}>Updated: Oldest</MenuItem>
            <MenuItem value={GOJUON_JUN}>五十音順</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={styles.itemList}>
        {filteredItemList && filteredItemList.map(item =>
          <ItemCard key={item.id} item={item} />
        )}
      </div>
    </div>
  );
};

export default VoiceActorListPage;