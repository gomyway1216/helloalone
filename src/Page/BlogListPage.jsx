import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../Firebase/blog';
import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'html-react-parser';
import './BlogListPage.scss';

const Blog = ({ history }) => {
  const [blogList, setBlogList] = useState();

  const getBlogIdList = async () => {
    const result = await blogApi.getBlogListId();
    setBlogList(result);
  };

  useEffect(() => {
    getBlogIdList();
  }, []);

  const useStyle = makeStyles({
    root: {
      margin: '8px'
    }
  });

  return (
    <div className="blog-container">
      <h1>Blog List</h1>
      <Button color="primary" onClick={() => history.push('/create')}>Create Blog</Button>
      <Button color="primary" onClick={() => history.push('/blog')}>Blog</Button>
      {blogList && blogList.map(blog => 
        <Card key={blog.id} className="blog-card">
          <CardContent>
            <>
              <div className="blog-title">{blog.id}</div>
              <div className="blog-content">{parse(blog.value)}</div>
            </>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  history: PropTypes.object
};