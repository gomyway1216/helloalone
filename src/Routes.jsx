import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import HomePage from './Page/HomePage';
import CreateBlogPage from './Page/CreateBlogPage';
import BlogListPage from './Page/BlogListPage';
import RankingPage from './Page/Ranking/RankingPage';

const Routes = () => {
  return (
    <Switch>
      <Route path='/' component={HomePage} exact />
      <Route path='/create' component={CreateBlogPage} />
      <Route path='/blog' component={BlogListPage} />
      <Route path='/ranking' component={RankingPage} />
    </Switch>
  );
};

export default Routes;