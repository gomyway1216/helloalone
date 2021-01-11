import React from 'react';
import PropTypes from 'prop-types';
import GeneralRanking from '../../Component/Ranking/GeneralRanking';

const RankingPage = () => {
  return (
    <div>
      <GeneralRanking itemName="anime"/>
    </div>
  );
};

export default RankingPage;

RankingPage.propTypes = {
  history: PropTypes.object
};