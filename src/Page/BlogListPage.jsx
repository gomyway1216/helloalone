import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as blogApi from '../Firebase/blog';
import './BlogListPage.scss';
import CustomCard from '../Component/Blog/CustomCard';

const USER_NAME = 'yyaguchi';

const Blog = () => {
  const [blogList, setBlogList] = useState();

  const getBlogIdList = async () => {
    const result = await blogApi.getBlogList(USER_NAME);
    setBlogList(result);
  };

  useEffect(() => {
    getBlogIdList();
  }, []);

  return (
    <div className="blog-container">
      <h1>Blog List</h1>
      {/* {blogList && blogList.map(blog => 
        <CustomCard key={blog.id} blog={blog}/>
      )} */}
      {blogList && blogList.map(blog => 
        <CustomCard key={blog.id} blog={blog}/>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  history: PropTypes.object
};