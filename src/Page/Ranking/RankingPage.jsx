import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AnimeRanking from '../../Component/Ranking/AnimeRanking';
import GeneralRanking from '../../Component/Ranking/GeneralRanking';

const RankingPage = () => {
  return (
    <div>
      <AnimeRanking />
      <GeneralRanking itemName="anime"/>
    </div>
  );
};

export default RankingPage;

RankingPage.propTypes = {
  history: PropTypes.object
};