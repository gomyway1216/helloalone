import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../Firebase/blog';
import { Button } from '@material-ui/core';
import parse from 'html-react-parser';

const Blog = ({ history }) => {
  const [blogList, setBlogList] = useState();

  const getBlogIdList = async () => {
    const result = await blogApi.getBlogListId();
    setBlogList(result);
  };

  useEffect(() => {
    getBlogIdList();
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      <Button color="primary" onClick={() => history.push('/create')}>Create Blog</Button>
      <Button color="primary" onClick={() => history.push('/blog')}>Blog</Button>
      {blogList && blogList.map(blog => 
        <div key={blog.id}>
          <div>{blog.id}</div>
          {parse(blog.value)}
        </div>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  history: PropTypes.object
};