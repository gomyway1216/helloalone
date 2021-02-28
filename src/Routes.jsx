import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import HomePage from './Page/HomePage';
import CreateBlogPage from './Page/CreateBlogPage';
import BlogListPage from './Page/BlogListPage';
import RankingPage from './Page/Ranking/RankingPage';
import BlogPage from './Page/BlogPage';

const Routes = () => {
  return (
    <div className="page-container">
      <Switch>
        <Route path='/' component={HomePage} exact />
        <Route path='/create' component={CreateBlogPage} />
        <Route path='/blog' component={BlogListPage} exact />
        <Route path='/blog/:id' component={BlogPage} />
        <Route path='/ranking' component={RankingPage} />
      </Switch>
    </div>
  );
};

export default Routes;