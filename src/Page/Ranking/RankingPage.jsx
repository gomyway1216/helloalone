import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AnimeRanking from '../../Component/Ranking/AnimeRanking';

const RankingPage = () => {
  return (
    <AnimeRanking />
  );
};

export default RankingPage;

RankingPage.propTypes = {
  history: PropTypes.object
};