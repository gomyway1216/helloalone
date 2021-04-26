import React, { useEffect, useState } from 'react';
import * as projectApi from '../../Firebase/project';
import * as projectUtil from '../../util/projectUtil';
import { Radio, RadioGroup, FormControlLabel, FormControl, Button, 
  InputLabel, MenuItem, FormHelperText, Select} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './PredictionProjectPage.scss';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const PredictionProjectPage = () => {
  const [choice, setChoice] = useState('1');
  const [generatedNumber, setGeneratedNumber] = useState('?');
  const [totalCount, setTotalCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const classes = useStyles();
  const [mode, setMode] = React.useState(2);
  const [accumulation, setAccumulation] = useState([]);

  const getAccumulation = async () => {
    const result = await projectApi.getAccumulation();
    result.sort((a, b) => a.value.choices - b.value.choices);
    setAccumulation(result);
  };

  useEffect(() => {
    getAccumulation();
  }, [totalCount]);

  const handlePredictionModeChange = event => {
    setMode(event.target.value);
    setTotalCount(0);
    setCorrectCount(0);
  };

  const handleChange = (event) => {
    setChoice(event.target.value);
  };

  const onSubmit = () => {
    const generated = projectUtil.generateRandomNumber(mode);
    const match = parseInt(choice) === generated;
    if(match) {
      setCorrectCount(correctCount+1);
    }
    projectApi.incrementAccumulation(mode, match, getAccumulation);
    setTotalCount(totalCount+1);
    setGeneratedNumber(generated);
  };

  return (
    <div>
      <div className="title">Guess the number!!</div>
      <div className='mode-selector'>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-helper-label">Mode</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={mode}
            onChange={handlePredictionModeChange}
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
          <FormHelperText>Choose the number of choices</FormHelperText>
        </FormControl>
      </div>
      <div>
        <div className="random-number">{generatedNumber}</div>
      </div>
      <div>
        <div className="result">{generatedNumber === '?' ? 'Try!' : (generatedNumber === parseInt(choice) ? 'Correct!' : 'Wrong!')}</div>
      </div>
      <div className="choices">
        <FormControl component="fieldset">
          <RadioGroup aria-label="gender" name="gender1" value={choice} onChange={handleChange}>
            {Array.from(Array(mode)).map((x, index) => <FormControlLabel key={index + 1} value={(index+1).toString()} control={<Radio />} label={index+1}/>)}
          </RadioGroup>
        </FormControl>
      </div>
      <div className="submit-button">
        <Button variant="contained" color="primary" onClick={onSubmit}>Submit</Button>
      </div>

      <div className="statistics">
        <div className="title">Analysis</div>    
        <div>Total : {totalCount}</div>
        <div>Correct: {correctCount}</div>
        <div>Expected: {(1 * 100 / mode).toFixed(2)} %</div>
        <div>Accuracy: {(correctCount * 100 / totalCount).toFixed(2)} %</div>
      </div>

      <div className="summary">
        <div className="title">Summary</div>
        <div className="wrapper">
          {accumulation.map(stat => (
            <div className="statistics" key={stat.id}>
              <div className="title">{stat.value.choices} choices</div>    
              <div>Total : {stat.value.totalCount}</div>
              <div>Correct: {stat.value.correctCount}</div>
              <div>Expected: {stat.value.expected} %</div>
              <div>Accuracy: {(stat.value.correctCount * 100 / stat.value.totalCount).toFixed(2)} %</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionProjectPage;